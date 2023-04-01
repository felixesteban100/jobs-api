const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        require: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Please provide password'],
        minLength: 6,
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcryptjs.genSalt(10) // generate random bites
    this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.methods.createJWT = function (){
    return jwt.sign(
        { userId: this._id, name: this.name }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_LIFETIME }
    )
}

UserSchema.methods.comparePassword = async function (userPassword){
    const isMatch = await bcryptjs.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)