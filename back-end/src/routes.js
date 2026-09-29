import express from 'express';
const routes = express.Router();
import comidaC from './controllers/comidaController.js'
import funcC from './controllers/funcionarioController.js'

routes.post("/pratos", comidaC.addComida);
routes.get("/pratos", comidaC.getComidas);
routes.put("/pratos/:id", comidaC.alterarComida);
routes.delete("/pratos/:id", comidaC.deletarComida);

routes.post("/cadastroF", funcC.cadastrar)
routes.post("/loginF", funcC.login)

export default routes;