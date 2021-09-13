const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profileImage : {
        type : String
    }

}, {timestamps : true})

userSchema.statics.isEmailAlreadyExists = async function (email) {
try {
    const usersWithEmail = await this.countDocuments({email})
    
    if (usersWithEmail !== 0) return true
    else return false
} catch (error) {
    return false  
}
}


whiteListTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        unique: true
    }
})

userModel = mongoose.model("User", userSchema, "User")
whiteListTokenModel = mongoose.model("WhiteListToken", whiteListTokenSchema, "WhiteListToken")

module.exports = {
    userModel, whiteListTokenModel
}