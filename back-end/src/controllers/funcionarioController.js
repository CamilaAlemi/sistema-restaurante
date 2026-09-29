import funcionarioModel from "../models/funcionarioModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const cadastrar = async (req, res) => {
  const senha = req.body.senha;
  const senhaHasheada = await bcrypt.hash(senha, 10);
  const dados = { ...req.body, senha: senhaHasheada };

  const funcionario = await funcionarioModel.getFuncionariosEmail(dados.email);

  if (funcionario.length)
    return res
      .status(401)
      .json({ mensagem: "Esse funcionário já está cadastrado" });

  const respCadastro = await funcionarioModel.cadastrar(funcionario);

  if (!respCadastro.cadastrou)
    return res
      .status(401)
      .json({ mensagem: "Ocorreu um erro durante o cadastro" });

  const token = jwt.sign(
    { id: respCadastro.id, cargo: funcionario.cargo },
    process.env.ASSINATURA,
    { expiresIn: "3d" },
  );

  return res
    .status(201)
    .json({ mensagem: "Cadastro realizado com sucesso!", token });
};

// let tentativas_login = {};
// let limite_tentativas = 3;

const login = async (req, res) => {
  const { email, senha } = req.body;

//   const registro = tentativas_login[email];

//   if (registro?.bloqueadoAte && registro.bloqueadoAte > Date.now()) {
//     const segundosRestantes = Math.ceil(
//       (registro.bloqueadoAte - Date.now()) / 1000,
//     );

    // return res.status(429).json({
    //   mensagem: `Tentativas esgotadas. Tente novamente em ${segundosRestantes}s`,
    // });

  try {
    const funcionario = await funcionarioModel.getFuncionariosEmail(email);
    if (!funcionario)
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });

    const senhaCorreta = await bcrypt.compare(senha, funcionario.senha_func);
    if (!senhaCorreta) {
    //   const tentativasAtuais = (registro?.tentativas || 0) + 1;
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: funcionario.id_func, numTentativas: i, cargo: funcionario.cargo },
      process.env.ASSINATURA,
      { expiresIn: "3d" },
    );

    return res.status(200).json({ mensagem: "Login realizado!", token });
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ mensagem: "Erro interno ao realizar login" });
  }
};

export default { cadastrar, login };
