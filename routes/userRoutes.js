const express = require('express');
const passport = require('passport');
const users = require('../controllers/users');


const router = express.Router();

router.route('/register')
    .get(users.getRegister)
    .post(users.postRegister)

router.route('/login')
    .get(users.getLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.postLogin)

router.get('/logout', users.logout)

module.exports = router;