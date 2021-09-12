const MyErrors = require('./CustomError.js')
const Joi = require('joi')
const multer = require('multer')
const jwt = require('jsonwebtoken')

const errorHandler = (err, req, res, next) => {
    let status = 500
    let msg = "Internal Server Error"
    console.log(err)
    let data = {
        status,
        msg
    }
    
    //This is for Custom Error Which is created custom by Function as required
    if (err instanceof MyErrors){
        data = {
            status : err.statusCode,
            msg : err.errorMsg
        }
        
        return res.status(err.statusCode).json(data)
    }

    //This is Validation Error which invoked by Joi
    else if(err instanceof Joi.ValidationError){
        data = {
            status : 422,
            msg : err.message
        }
        return res.status(422).json(data)
    }else if(err instanceof multer.MulterError){
        data = {
            status : 422,
            msg : err.message
        }
        return res.status(422).json(data)
    }

    //Json Wen Token Error
    else if(err instanceof jwt.JsonWebTokenError){
        data = {
            status : 422,
            msg : err.message
        }
        return res.status(422).json(data)
    }
    //Json Wen Token Error
    else if(err instanceof SyntaxError){
        data = {
            status : 422,
            msg : err.message
        }
        return res.status(422).json(data)
    }

    //Other Unhandled Error which can be Server Error
    else{
        return res.status(status).json(data)
    }   

}

module.exports = errorHandler