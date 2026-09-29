import con from './connection.js';

const cadastrar = async (funcionario)=>{
    const {nome, email, senha, celular, cargo, salario, foto} = funcionario;
    const query = `INSERT INTO funcionario VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
    const [resposta] = await con.execute(query, [null, nome, email, senha, celular, cargo, salario, foto]);
    return {id: resposta.insertId, cadastrou: resposta.affectedRows};
}

const mostrarFuncionarios = async ()=>{
    const [resposta] = await con.execute("SELECT * FROM funcionario");
    return resposta;
}

const getFuncionariosEmail = async (email)=>{
    const [resposta] = await con.execute("SELECT * FROM funcionario WHERE email_func = ?", [email]);
    return resposta[0];
}

export default {cadastrar, mostrarFuncionarios, getFuncionariosEmail}