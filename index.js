const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const cors = require('cors')
mongoose.connect('mongodb://localhost:27017/Attendance_Management', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('DB Connected')
    })
    .catch(() => {
        console.log('TOO many errors')
    })
//middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
//use routes 
app.use('/api', authRoutes);
app.listen(PORT, () => {
    console.log('Listenning to PORT ', PORT);
})