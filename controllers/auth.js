const User = require('../models/User')
//sign up 
exports.signUp = async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    try {
        const user = await User.findOne({ email })
        if (!user) {
            await new User({ email, password ,role:1}).save()
                .then((newuser) => {
                    return res.status(200).json(newuser)
                })
        }
        else {
            return res.status(400).json({
                Error: 'Email already exist'
            })
        }
    } catch (error) {
        //do something
        console.log(error)
    }
}

// login  
exports.signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validate = await User.findOne({ email: email })
            
            .populate('enrolled_course')
            .populate('enrolled_course_attendance')
            .exec();
        if (!validate) {
           
            return res.status(401).json({
                'Error': 'User email doesnot exist'
            })
        }
        if (validate.password !== password) {
            (validate)
            return res.status(401).json({
                'Error': 'Password didnt match'
            })
        }

        return res.status(200).json({
            _id: validate._id,
            enrolled_course: validate.enrolled_course,
            email: validate.email,
            name:validate.name,
            role : validate.role,
        });
    } catch (error) {
        //do something
        console.log(error)
        }
    next();
}

exports.getUserById = async(req, res) => {
    
    const id = req.params.id;
    const user = await User.findById(id)
        .select('-password')
        .populate('enrolled_course')
        .populate('enrolled_course_attendance')
        .exec()
    if (!user) {
        return res.status(404).json({
            msg:'Not found'
        })
    }
    return res.status(200).json(user);
}