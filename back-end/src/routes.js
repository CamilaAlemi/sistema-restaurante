import express from 'express';
const routes = express.Router();
import teste from './controllers/testControllers.js'

routes.get("/", teste.test);

export default routes;