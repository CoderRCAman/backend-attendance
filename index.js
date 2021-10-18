const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/AdminRoutes');
const cors = require('cors')
mongoose.connect('mongodb+srv://Server:1234@cluster0.0ychj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
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
app.use('/api', adminRoutes);
app.listen(PORT, () => {
    console.log('Listenning to PORT ', PORT);
})