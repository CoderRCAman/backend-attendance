const Course = require('../models/Course') 

const ifDateExist = (dates,date) => {
    // return true or false
    //convert date to actual date 
    const convertedDate = [] ; 
   
    dates.forEach(element => {
        convertedDate.push(element.split('T')[0])
    });

    if(convertedDate.includes(date.split('T')[0])){
        return true
    } 
    return false ; 
}

exports.checkMarkedDates = async (req, res, next) => {
    const id = req.params.id;
    const date = req.body.date;
    
    const course = await Course.findById(id).exec();
    if (course.course_duration === course.dates.length) {
        return res.status(404).json({msg: 'Course Already Expired'});
    }
    if ( course.dates=== null || !ifDateExist(course.dates,date)) {
        next();
    }
    else {
        return res.status(404).json({msg: 'Date already Marked'});
    }
  
}