import connection from "../models/connection.js";

async function test(_req, res) {
  const [test] = await connection.execute("SELECT * FROM comidas");
  return res.json(test);
}

async function test2(_req, res) {
  const [test] = await connection.execute("SELECT * FROM comidas");
  return res.json(test);
}

export default {
    test,
    test2
};
