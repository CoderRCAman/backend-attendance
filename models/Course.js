const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true,
        trim: true
    },
    specified_id: {
        type: String,
        required: true,
        trim: true
    },
    course_duration: {
        type: Number,
        required: true, 
        trim: true
    },
    course_description: {
        type: String,
        required: true,
        trim:true 
    },
    dates: {
        type: [],
        default :[Date] 
    }
})

module.exports = mongoose.model('Course', courseSchema);