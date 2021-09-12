const jwt = require('jsonwebtoken');

class MyJWT {
    static create(data, secret){
        return jwt.sign(data, secret, {expiresIn : '180s'})
    }

    static refresh(data, secret){
        return jwt.sign(data, secret, {expiresIn : '1y'})
    }
}

module.exports = MyJWT;