const mongoose = require('mongoose');
const Course = require('./Course');
const Attendance = require('./Attendance');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specified_id: {
        type: String,
        required: true,
        trim :true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: Number,
        default: 0 
    },
    enrolled_course:
     [
        { type: Schema.Types.ObjectId ,ref:Course}
     ],
    enrolled_course_attendance:
     [
        { type: Schema.Types.ObjectId,ref:Attendance }
     ]
})

module.exports = mongoose.model('User', userSchema);