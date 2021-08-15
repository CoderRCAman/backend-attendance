const express = require('express');
const {  addCourse, getCourse, getUsers, addUser,deleteUser, assignCourse, deleteCourse, editMarkedAttendance,editUser, getUsersByCourseId,markAttendance } = require('../controllers/AdminController');
const { checkMarkedDates } = require('../controllers/Middlewares');
const Router = express.Router();

Router.post('/addcourse/:id', addCourse);
Router.delete('/delete/:id/:_id',deleteUser) ; 
Router.get('/course/:id', getCourse);
Router.get('/users/:id', getUsers);
Router.post('/adduser/:id', addUser);
Router.post('/assigncourse/:id', assignCourse);
Router.delete('/delete/course/:id', deleteCourse)
Router.put('/edit/:id', editUser);
Router.get('/users/:id/:_id', getUsersByCourseId);
Router.post('/mark/:id', checkMarkedDates, markAttendance);
Router.post('/mark/edit/:id',  editMarkedAttendance);
module.exports = Router;