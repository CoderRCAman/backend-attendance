const express = require('express');
const Router = express.Router();
const { signUp, signin } = require('../controllers/auth');
Router.post('/signup', signUp)
Router.post('/signin', signin)
module.exports = Router;