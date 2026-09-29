import jwt from 'jsonwebtoken';

// funcao do verificar token envolve muita coisa, mas, principalmente,
// verificar se existe
// verificar se está correto com a assinatura
// e permitir a autorização para fazer algo posterior com o next()

const verificaToken = (req, res, next)=>{
    const AuthHeader = req.headers.authorization;

    if(!AuthHeader) res.status(401).json({mensagem: "Token não informado."});

    const token = AuthHeader.split(" ")[1];

    try{
        const funcionario = token.verify(token, process.env.ASSINATURA);
        req.usuario = funcionario;
        next();
    }catch(error){
        res.status(401).json({mensagem: "Token inválido"});
    }
}

export default verificaToken;