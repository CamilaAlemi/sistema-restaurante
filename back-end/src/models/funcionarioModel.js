import con from "./connection.js";

const cadastrar = async (funcionario) => {
  const { nome, email, senha, celular, cargo, salario, foto } = funcionario;
  const query = `INSERT INTO funcionario VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
  const [resposta] = await con.execute(query, [
    null,
    nome,
    email,
    senha,
    celular,
    cargo,
    salario,
    foto,
  ]);
  return { id: resposta.insertId, cadastrou: resposta.affectedRows };
};

const mostrarFuncionarios = async () => {
  const [resposta] = await con.execute("SELECT * FROM funcionario");
  return resposta;
};

const getFuncionariosEmail = async (email) => {
  const [resposta] = await con.execute(
    "SELECT * FROM funcionario WHERE email_func = ?",
    [email],
  );
  return resposta[0];
};

const alterarFuncionario = async (id, novoFuncionario) => {
  const { nome, email, senha, celular, cargo, salario, foto } = novoFuncionario;

  const query = `UPDATE funcionario SET nome_func = ?, email_func = ?, 
  senha_func = ?, telefone_func = ?, cargo = ?, salario = ?, foto = ? WHERE id_func = ?`;

  const [resposta] = await con.execute(query, [
    nome,
    email,
    senha,
    celular,
    cargo,
    salario,
    foto,
    id,
  ]);

  return resposta.affectedRows;
};

const deletarFuncionario = async (id)=>{
    const [resposta] = await con.execute(`DELETE FROM funcionario WHERE id_func = ?`, [id]);
    return resposta.affectedRows;
}

export default { cadastrar, mostrarFuncionarios, getFuncionariosEmail, alterarFuncionario, deletarFuncionario };
