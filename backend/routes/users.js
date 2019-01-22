const express = require('express');
const {
    check,
    body
} = require('express-validator/check')

const usersController = require('../controller/users');
const isAuth = require('./isAuth');

const router = express.Router();

router.post('/signup', [
        body('email' ,'Enter a valid E-Mail').isEmail(),
        body('password').isLength({min: 6})
        // .isAlphanumeric()
    ],
    usersController.postSignUp)

router.post('/signin', [
        body('email','E-Mail or password is not correct').isEmail(),
        body('password').isString()
    ],
    usersController.postSignIn)
router.get('/user', isAuth, usersController.getUser);
router.post('/edit', [
    body('username', 'Username should be atleast 5 character').isLength({min: 3}),
    body('mobile','Mobile should be a number').isNumeric(),
], isAuth, usersController.updateUser);

module.exports = router;