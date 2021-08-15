const express = require('express');
const Router = express.Router();
const { signUp, signin ,getUserById} = require('../controllers/auth');
Router.post('/signup', signUp)
Router.post('/signin', signin)
Router.get('/user/:id',getUserById)
module.exports = Router;

