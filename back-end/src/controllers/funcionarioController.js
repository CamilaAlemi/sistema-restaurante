import funcionarioModel from "../models/funcionarioModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const cadastrar = async (req, res) => {
  const senha = req.body.senha;
  const senhaHasheada = await bcrypt.hash(senha, 10);
  const dados = { ...req.body, senha: senhaHasheada };

  const funcionario = await funcionarioModel.getFuncionariosEmail(dados.email);

  if (funcionario)
    return res
      .status(401)
      .json({ mensagem: "Esse funcionário já está cadastrado" });

  const respCadastro = await funcionarioModel.cadastrar(req.body);

  if (!respCadastro.cadastrou)
    return res
      .status(401)
      .json({ mensagem: "Ocorreu um erro durante o cadastro" });

  const token = jwt.sign(
    { id: respCadastro.id, cargo: respCadastro.cargo },
    process.env.ASSINATURA,
    { expiresIn: "3d" },
  );

  return res
    .status(201)
    .json({ mensagem: "Cadastro realizado com sucesso!", token });
};

let tentativasLogin = {};
let limiteTentativas = 3;
let tempoBloq = 10 * 60 * 1000;

const login = async (req, res) => {
  const { email, senha } = req.body;

  const registro = tentativasLogin[email];

  if (registro?.bloqueadoAte && registro.bloqueadoAte > Date.now()) {
    const seg_restantes = Math.ceil(
      (registro.bloqueadoAte - Date.now()) / 1000,
    );
    return res.status(429).json({
      mensagem: `Tentativas esgotadas. Tente novamente em ${segundosRestantes}s`,
    });
  }

  try {
    const funcionario = await funcionarioModel.getFuncionariosEmail(email);
    if (!funcionario)
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });

    const senhaCorreta = await bcrypt.compare(senha, funcionario.senha_func);
    if (!senhaCorreta) {
      const tentativasAtuais = (registro?.tentativas || 0) + 1;

      tentativasLogin[email] = {
        tentativas: tentativasAtuais,
        bloqueadoAte:
          tentativasAtuais >= limiteTentativas ? Date.now() + tempoBloq : null,
      };

      if (tentativasAtuais >= limiteTentativas)
        return res.status(429).json({
          mensagem:
            "Tentativas de login esgotadas. Tente novamente em 10 minutos",
        });

      return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: funcionario.id_func, numTentativas: i, cargo: funcionario.cargo },
      process.env.ASSINATURA,
      { expiresIn: "3d" },
    );

    delete funcionario.senha_func;

    return res.status(200).json({ mensagem: "Login realizado!", token });
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ mensagem: "Erro interno ao realizar login" });
  }
};

const mostrarFuncionarios = async (req, res) => {
  const resposta = await funcionarioModel.mostrarFuncionarios();
  return res.status(200).json(resposta);
};

const alterarFuncionario = async (req, res) => {
  const id = req.params.id;

  try {
    const alterou = await funcionarioModel.alterarFuncionario(id, req.body);
    if (!alterou)
      return res.status(401).json({
        mensagem: "Erro ao atualizar usuário. Envie corretamente os dados",
      });
    return res.status(200).json({mensagem: "Funcionário alterado com sucesso"})
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({ mensagm: "Erro interno ao alterar usuário" });
  }
};

const deletarFuncionario = async (req, res) => {
  const deletou = await funcionarioModel.deletarFuncionario(req.params.id);
  console.log(deletou)
  if (!deletou)
    return res
      .status(401)
      .json({ mensagem: "Erro ao deletar funcionário. Tente novamente" });
  return res.status(200).json({ mensagem: "Funcionário deletado com sucesso" });
};

export default {
  cadastrar,
  login,
  mostrarFuncionarios,
  alterarFuncionario,
  deletarFuncionario,
};
