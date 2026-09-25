import express from 'express';
const routes = express.Router();
import comidaC from './controllers/comidaController.js'

routes.post("/pratos", comidaC.addComida);
routes.get("/pratos", comidaC.getComidas);
routes.put("/pratos/:id", comidaC.alterarComida);
routes.delete("/pratos/:id", comidaC.deletarComida);

export default routes;