const Joi = require('joi')
const bcrypt = require('bcrypt')
const models = require('../models/user')
const customError = require('../errorhandler/CustomError.js')
const MyJWT = require('../tokenhandler/MyJWT')
const jwt = require('jsonwebtoken')


async function signUpView(req, res, next){
   
    const validatePattern = Joi.object(
        {
            name : Joi.string().min(3).max(20).required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]+[\@|\$|\%|\!|\#]+')),
            repeat_password : Joi.ref('password'),
            email: Joi.string().pattern(new RegExp('^([a-z0-9\.])+\@([a-z0-9]+\.)+[a-z]{2,4}$'))
        }
    )
    
    let data = req.body
    let file = req.file

    try{
        const value = await validatePattern.validateAsync(data)
        const passwordToBeHashed = value.password
        
        bcrypt.hash(passwordToBeHashed, 10, 
            async (err, hashedPassword) => {
                if(err){
                    next(err)
                }
                else{
                    const userdata = {
                        username : data.name,
                        email : data.email,
                        password : hashedPassword,
                        profileImage : file.path
                    }
                   
                    try {
                        const isExists = await models.userModel.isEmailAlreadyExists(data.email)
                    
                        if (isExists){
                            next(customError.alreadyExist("Email Already Exists"))
                        }
                        else{
    
                            try {
                                const user = await new models.userModel(userdata)
                                user.save()
                                return res.json(user)
                                
                            } catch (error) {
                               
                                next(error)
                            }
                            
                        }
                    
                    } catch (error) {
                        
                        next(error)
                    }
                }
            })
    }
    catch(err){
        next(err)
    }

    
}

async function loginView(req, res, next){
    let validatePattern = Joi.object(
        {
            email: Joi.string().pattern(new RegExp('^([a-z0-9\.])+\@([a-z0-9]+\.)+[a-z]{2,4}$')),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]+[\@|\$|\%|\!|\#]+')),
        }
    )

    try {
        const value = await validatePattern.validateAsync(req.body)

        const email = value.email

        let getUser = await models.userModel.findOne({
            email
        })
        
        if(getUser){
            const hashedPassword = getUser.password
            const result = await bcrypt.compare(req.body.password, hashedPassword )
            if(result){
                let payload = {
                    "username" : getUser.username,
                    "email": getUser.email
                }
                let access_token = MyJWT.create(payload, "AccessSecret")
                let refresh_token = MyJWT.refresh(payload, "RefreshSecret")
                
                
                
                addNewWhiteList = await new models.whiteListTokenModel({
                    token : refresh_token
                })
                addNewWhiteList.save()
           


                return res.json({
                    access_token,
                    refresh_token
                })
            }
            else{
                next(customError.dataValidationError("Invalid Password !!"))
            }

        }
        else{
            next(customError.notFoundError("User with this Email not Found"))
        }

        
    } catch (error) {
        next(error)
    }
}

async function refreshToken(req, res, next){
    actualRefresh = req.body.refresh_token

    checkWhiteList = await models.whiteListTokenModel.findOne({
        token : actualRefresh
    })

    if(checkWhiteList){

        let decoded = jwt.decode(actualRefresh)
        data = {
            "username" : decoded.username,
            "email" : decoded.email
        }
        let access_token = MyJWT.create(data, "AccessSecret")
        let refresh_token = MyJWT.refresh(data, "RefreshSecret")
        return res.json({
            access_token, refresh_token
        })
    }
    else{
        next(customError.notFoundError("Invalid Refresh Token"))
    }

}


async function logoutView(req, res, next){
    actualRefresh = req.body.refresh_token

    checkWhiteList = await models.whiteListTokenModel.findOne({
        token : actualRefresh
    })

    if(checkWhiteList){
        try {
            await models.whiteListTokenModel.deleteOne({
                token : actualRefresh
            })
            return res.json({
                "msg" : "logged Out"
            })
        } catch (error) {
            next(error)
        }
    }
    else{
        next(customError.notFoundError("Refresh Token Expired.."))
    }

    
}


module.exports = {
    signUpView, loginView, refreshToken, logoutView
}
