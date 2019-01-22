const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    validationResult
} = require('express-validator/check')

const User = require('../models/user')

exports.postSignUp = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const username = req.body.username
    const mobile = req.body.mobile
    const age = req.body.age
    const bio = req.body.bio
    const valError = validationResult(req)

    if (!valError.isEmpty()) {
        console.log(valError.array())
        const error = new Error(valError.array()[0].msg)
        error.statusCode = 422
        throw error
    }

    User.findOne({
            email: email,
            username: username
        })
        .then(userDoc => {
            if (userDoc) {
                const error = new Error('User already exist!')
                error.statusCode = 422;
                throw error
            }
            return bcrypt.hash(password, 12)
        })
        .then(hash => {
            const user = new User({
                email: email,
                password: hash,
                username: username,
                mobile: mobile,
                age: age,
                bio: bio
            })
            return user.save()
        })
        .then(user => {
            console.log(user)
            return res.status(201).json({
                email,
                msg: "User created"
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.postSignIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const valError = validationResult(req)

    if (!valError.isEmpty()) {
        console.log(valError.array())
        const error = new Error(valError.array()[0].msg)
        error.statusCode = 422
        throw error
    }

    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                const error = new Error('E-mail not found')
                error.statusCode = 401
                throw error
            }
            loadedUser = user
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            console.log(isEqual)
            if (!isEqual) {
                const error = new Error('Wrong Password');
                error.statusCode = 401;
                throw error
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'someSecretMoreAndMoreSecret');
            return res.status(200).json({
                userId: loadedUser._id.toString(),
                token
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.getUser = (req, res, next) => {
    const userId = req.userId

    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found')
                error.statusCode = 404;
                throw error
            }
            console.log(user)
            const userData = [{
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                bio: user.bio,
                age: user.age
            }]
            return res.status(200).json({
                user: userData
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.updateUser = (req, res, next) => {
    const userID = req.userId
    const username = req.body.username
    const age = req.body.age
    const bio = req.body.bio
    const mobile = req.body.mobile
    console.log(userID,' user ki id')
    const valError = validationResult(req)

    if (!valError.isEmpty()) {
        console.log(valError.array())
        const error = new Error(valError.array()[0].msg)
        error.statusCode = 422
        throw error
    }
    
    User.findByIdAndUpdate(userID, {
        $set: {
            username: username,
            age: age,
            bio: bio,
            mobile: mobile
        }
    })
    .then(user => {
        console.log(user)
            return res.json(user)
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
}