const User = require('../models/User')
//sign up 
exports.signUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            await new User({ email, password }).save()
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
    }
}

// login  
exports.signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validate = await User.findOne({ 'email': email });
        if (!validate) {
            return res.status(401).json({
                'Error': 'User email doesnot exist'
            })
        }
        if (validate.password !== password) {
            return res.status(401).json({
                'Error': 'Password didnt match'
            })
        }

        return res.status(200).json({ email: validate.email, role: validate.role });
    } catch (error) {
        //do something
    }
    next();
}