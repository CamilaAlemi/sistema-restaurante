import con from "./connection.js";

const addComida = async (comida) => {
  const { id, nome, desc, cat, sub_cat, preco } = comida;
  const query = `INSERT INTO prato VALUES(?,?,?,?,?,?)`;
  const [resposta] = await con.execute(query, [
    id,
    nome,
    desc,
    cat,
    sub_cat,
    preco,
  ]);
  return resposta.affectedRows;
};

const getComidas = async () => {
  const [comidas] = await con.execute("SELECT * FROM prato");
  return comidas;
};

const alterarComida = async (id, comida) => {
  const {nome, desc, cat, sub_cat, preco} = comida;
  const query = `UPDATE prato SET nome_prato = ?, desc_prato = ?, categoria = ?, sub_categoria = ?, preco = ? 
  WHERE id_prato = ?`;
  const [resposta] = await con.execute(query, [nome, desc, cat, sub_cat, preco, id]);
  return resposta.affectedRows;
};

const deleteComida = async (id) => {
  const [resposta] = await con.execute('DELETE FROM prato WHERE id_prato = ?', [id]);
  return resposta;
};

export default { addComida, getComidas, alterarComida, deleteComida };
