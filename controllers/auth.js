const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

async function register(req, res){
    // this error handler isn't necessary (but I like to double check the security)
    const { name, email, password } = req.body
    if(!name || !email || !password) throw new BadRequestError('Please provide name, email and password')
    // this error handler isn't necessary (but I like to double check the security)

    const user = await User.create({...req.body})

    const token = user.createJWT()

    res
    .status(StatusCodes.CREATED)
    .json({ user: {name: user.name }, token })
}

async function login(req, res){
    const {email, password} = req.body

    if(!email || !password) throw new BadRequestError('Please provide email and password')

    const user = await User.findOne({ email })
    if(!user) throw new UnauthenticatedError('Invalid Credentials')
    
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')
    
    // compare/verified password
    const token = user.createJWT()

    res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login,
}