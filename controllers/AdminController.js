const Course = require('../models/Course');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
var mongoose = require('mongoose');
const { response } = require('express');


exports.addCourse = async (req, res) => {
  //  console.log(req.body);
    try {
        const id = req.params.id;
        const newCourse = new Course(req.body);
        newCourse.specified_id = id;
        const foundCourse = await Course.findOne({ course_name: req.body.course_name })
        if (foundCourse) {
            return res.status(400).json({ msg: "Course already exists" })
        }
        newCourse.save()
            .then((success) => {
                return res.status(200).send(success)
            })
            .catch(err => {
                return (err)
            })
    } catch (error) {
        return error
    }

} 

exports.deleteUser = async (req, res) => {
      console.log(req.params);
      try {
          const id = req.params.id; // spcific admin id 
          const _id = req.params._id // to delete user id 
          const deletedUser = await User.findOneAndDelete({_id:_id ,  specified_id:id}).exec() ; 
          if(deletedUser){
              return res.status(200).json(deletedUser) ; 
          }
          return res.status(400).json({msg:'Unable to delete'}) ; 
      } catch (error) {
          return error
      }
  
  }



exports.getCourse = (req, res) => {
    const id = req.params.id;
    Course.find({specified_id:id})
        .exec((err, courses) => {
            if (err) {
                return response.status(404).json({ msg: "Courses dont exist" });
            }
            return res.status(200).json(courses)
        })
}

exports.addUser = async (req, res) => {
    try {
        const id = req.params.id; 
        const userExist = await User.findOne({ email: req.body.email ,specified_id:id  });
        console.log(userExist)
        if (userExist) return res.status(400).json({ msg: "User already Exist" });
        const user = new User(req.body);
        user.specified_id = id; 
        user.save()
            .then(success => {
                return res.status(200).json(success);
            })
            .catch(err => {
                return err
            })
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.getUsers = async (req, res) => {
    const id = req.params.id;
    User.find({specified_id:id}).populate('enrolled_course').populate('enrolled_course_attendance')
        .exec((err, users) => {
            if (!err || users)
                return res.status(200).json(users);
            return res.staus(404).json({ msg: "Couldn't find any user" });
        })
}

exports.getUsersByCourseId = async (req, res) => {
    try {
        const id = req.params.id;
        const specified_id = req.params._id;
        const foundUsers = await User.find(
            { specified_id, enrolled_course: { $elemMatch: { $eq: id } } }
        )
            .select('-password')
            .populate('enrolled_course')
            .populate(' enrolled_course_attendance')
        .exec();
        if (foundUsers) {
            return res.status(200).json(foundUsers);
        }
        return res.status(404).json({msg:'Not found any user'})
    } catch (error) {
        console.log(error);
    }
}

exports.assignCourse = async (req, res) => {
    const assignedCourseArray = [];
    const assignedCourseAttendanceArray = [];
    const assignedCourseAttendanceArrayIds = [];
    const stuff = req.body;
    const id = req.params.id;

   // console.log(id);
    stuff.forEach(items => {
        // //create an attendance object and store in array 
        // console.log(items)
        const attendanceObj = {
            _id: new mongoose.Types.ObjectId(),
            course_name: items.course_name,
            uniquer_user_id: id 
        }
        assignedCourseAttendanceArray.push(attendanceObj);
        assignedCourseAttendanceArrayIds.push(attendanceObj._id);
        assignedCourseArray.push(items._id);
    });
   
    const response = await User.findByIdAndUpdate(id, {
        $addToSet: {
            enrolled_course: assignedCourseArray,
            enrolled_course_attendance: assignedCourseAttendanceArrayIds 
            }   
        },
    );
    const savedAttendance = await Attendance.insertMany(assignedCourseAttendanceArray);
    
    if (response && savedAttendance) {
        return res.status(200).json(response);
    }
    return res.status(401).json('un-authorised');
}


exports.deleteCourse = async (req, res) => {
    const course_id = req.params.id;
    //console.log(course_id)
    try {
        Course.findOneAndDelete({ _id: course_id }, (err, deletedCourse) => {
            if (deletedCourse || !err) {
                return res.status(200).json({ msg: "Successfully Deleted" });
            }
            else {
                return res.status(400).json({ msg: "Bad Request" });
            }
        });
    } catch (error) {
        console.log(error);
    }

}
exports.editUser = async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;
       // console.log(update);

        User.findByIdAndUpdate(id, update, { new: true }, (err, updatedUser) => {
            if (err || !updatedUser) {
                return res.status(400).json({ msg: 'NOT UPDATED' });
            }
            return res.status(200).json(updatedUser);
        })
    } catch (error) {
        console.log(error);
    }
}

const findIdOfAttendanceModelInUser = (attendanceModalArray, course_name) => {
    // a handy function to grab id from attendance object inside our huge user object
    // later to use this id to bulkwrite on attendance documents
    let id;
    attendanceModalArray.forEach(attendance => {
        if (attendance.course_name === course_name) {
            id = attendance._id;
            return;
        }

    })
    return id;
}

function bulkCallBack(error, bulkWriteOpResult) {
    if (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.markAttendance = async (req, res) => {

    try {

        const course_name = req.body.course.course_name;
        const student_records = req.body.record; //an array of student
        const date_of_marking = req.body.date;
        const course_id = req.body.course._id;
        //update our date array in course collection
        const updatedCourse = await Course.findByIdAndUpdate(course_id,
            {
                $push: { dates: date_of_marking }
            }).exec();
        if (!updatedCourse) return res.status(403).json({ msg: 'Server Error' });

        const present_ids = [];
        const absent_ids = [];
        //find all present ids
        //find all absent ids 
        student_records.forEach(student => {
            let attendance_id = findIdOfAttendanceModelInUser(student.item.enrolled_course_attendance, course_name);// grab id of attendance object 
            if (student.select) {
                present_ids.push(attendance_id);
            }
            else {
                absent_ids.push(attendance_id);
            }
        })
        // do a bulwrite on all present ids 
        const presentUserFilter = { _id: { $in: present_ids } };


        await Attendance.bulkWrite([
            {
                updateMany: {
                    filter: presentUserFilter,
                    update: {
                        $push: { present_days: date_of_marking }
                    }
                }
            }

        ], bulkCallBack)

        //do a bulk write on all absent ids
        const absentUserFilter = { _id: { $in: absent_ids } };
        await Attendance.bulkWrite([
            {
                updateMany: {
                    filter: absentUserFilter,
                    update: {
                        $push: {absent_days: date_of_marking }
                    }
                }
            }
        ], bulkCallBack)

        // finally everything is done 

        return res.status(200).json({ message: 'OK' });


    } catch (error) {
        console.log(error)
    }
}


exports.editMarkedAttendance = async (req, res) => {

    try {
        const course_name = req.body.course.course_name; //name of course
        const student_records = req.body.record; //an array of student
        const date_of_marking = req.body.date; // marked date 
        const course_id = req.body.course._id;//course if
        //remove all initial marked attendance from both present and absent arrays 
        //in attendance document 
        await Attendance.bulkWrite([
            {
                updateMany: {
                    filter: {},
                    update: {
                        $pull: { present_days: date_of_marking }
                    }
                }
            }

        ], bulkCallBack)
        await Attendance.bulkWrite([
            {
                updateMany: {
                    filter: {},
                    update: {
                        $pull: { absent_days: date_of_marking }
                    }
                }
            }

        ], bulkCallBack)

        //Rest same as marked attendance
        const present_ids = [];
        const absent_ids = [];
        //find all present ids
        //find all absent ids 
        student_records.forEach(student => {
            let attendance_id = findIdOfAttendanceModelInUser(student.item.enrolled_course_attendance, course_name);// grab id of attendance object 
            if (student.select) {
                present_ids.push(attendance_id);
            }
            else {
                absent_ids.push(attendance_id);
            }
        })
        // do a bulwrite on all present ids 
        const presentUserFilter = { _id: { $in: present_ids } };


        await Attendance.bulkWrite([
            {
                updateMany: {
                    filter: presentUserFilter,
                    update: {
                        $push: { present_days: date_of_marking }
                    }
                }
            }

        ], bulkCallBack)

        //do a bulk write on all absent ids
        const absentUserFilter = { _id: { $in: absent_ids } };
        await Attendance.bulkWrite([
            {
                updateMany: {
                    filter: absentUserFilter,
                    update: {
                        $push: {absent_days: date_of_marking }
                    }
                }
            }
        ], bulkCallBack)

        // finally everything is done 

        return res.status(200).json({ message: 'OK' });


    } catch (error) {
        console.log(error)
    }
}