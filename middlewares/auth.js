const jwt = require('jsonwebtoken')
const customError = require('../errorhandler/CustomError')
async function verifyAccessToken(req, res, next){
    jwt.verify(req.body.access_token, "AccessSecret", (error, data)=>{
        if(data){
            next();
        }
        else{
            next(error)
        }

    })
    
    
}

async function verifyRefreshToken(req, res, next){
    jwt.verify(req.body.refresh_token, "RefreshSecret", (error, data)=>{
        if(data){
            next();
        }
        else{
            next(error)
        }

    })
    
    
}

module.exports = {
    verifyAccessToken, verifyRefreshToken
}