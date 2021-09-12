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

module.exports = mongoose.model("User", userSchema, "User")