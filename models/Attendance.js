const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    course_name: {
        type: String,
        required: true,
    },

    uniquer_user_id: {
        type: String,
        required: true,
    },
    present_days: {
        type: [],
        required: true,
        default: [Date],
    },
    absent_days: {
        type: [],
        required: true,
        default: [Date],
    }
})

module.exports = mongoose.model('Attendance', attendanceSchema);