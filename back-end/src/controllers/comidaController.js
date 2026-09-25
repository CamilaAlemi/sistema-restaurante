import comidaModel from '../models/comidaModel.js'

const addComida = async (req, res)=>{
    const resposta = await comidaModel.addComida(req.body);
    if(resposta == 1) return res.status(200).json({mensagem: "Deu certo"}); 
}

const getComidas = async (_req, res)=>{
    const comidas = await comidaModel.getComidas();
    res.json({pratos: comidas});
}

const alterarComida = async (req, res)=>{
    const id = req.params.id;
    const resposta = await comidaModel.alterarComida(id, req.body);
    if(resposta == 1) return res.status(201).json({mensagem: "Prato alterado com sucesso!"});
}

const deletarComida = async (req, res)=>{
    const resposta = await comidaModel.deleteComida(req.params.id);
    return res.status(204).json({mensagem: resposta});
}

export default {addComida, getComidas, alterarComida, deletarComida}