const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'helloheytatabyebye'

// route 1 for creating user by taking name email and password

router.post('/createuser',
    [
        // validation of data send by user
        body('name').notEmpty().withMessage('Name is empty').isLength({min:3}).withMessage('Name length must be greater than 3.'),
        body('email').isEmail().withMessage('Please enter valid mail.'),
        body('password').isLength({min:6}).withMessage('Password must be 8 chracters long.')
    ],
    async (req,res)=>{
        // after validation we check for any error and return the validation result with error if any
        let success = false;
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ "errors": errors.array() , success});
            }
            //trying to find a user with same email address and return if user is found
            let user = await User.findOne({email:req.body.email});
            //console.log(user)
            if(user){
                return res.status(400).json({error:'Email Already Exist' , success})
            }
            
            //genrating password hash
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password,salt)

            // storing user in db
            user  =  await User.create({
                name : req.body.name,
                email : req.body.email,
                password : secPass,
            })

            //generating jwt token after storing user in db 
            const data = {
                user:{
                    id:user.id
                }
            };

            //returning jwt token which will later be used for autentication of user
            const authToken = jwt.sign(data,JWT_SECRET)
            success = true
            res.status(200).json({authToken,success});
        }
        catch(error){
            //returning internal server error if any unexpected things happend
            console.error(error.message);
            res.status(500).json({error:"Internal server Error", success})
        }
})

// route 2 for loggin user into the app
router.post('/login',
    [
        //validations 
        body('email').isEmail().withMessage('Please enter valid credentials.1'),
        body('password').isLength({min:6}).withMessage('Please Enter valid credentials.2')
    ],
    async (req,res)=>{
        let success = false;
        try{
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(401).json({errors:error.array(),success})
            }
            const {email,password} = req.body
            let user = await User.findOne({email:email});
            //console.log(user)
            if(!user){
                return res.status(400).json({error:'Please Enter valid credentials.3',success})
            }
            //compare the password sent with the password hash stored returning if not matching
            const passCompare = await bcrypt.compare(password,user.password)
            if(!passCompare){
                return res.status(400).json({error:'Please Enter valid credentials.4', success})
            }

            // returning the auth token
            const data = {
                user:{
                    id:user.id
                }
            };
            const authToken = jwt.sign(data,JWT_SECRET)
            success  = true;
            res.status(200).json({authToken,success});

        }
        catch(error){
            console.error(error.message);
            res.status(500).json({error:"Internal server Error", success})
        }
    }
)
// route 3 for getting user with auth token, we are using middleware here
// when a request is made it is sent to middleware first and then to this code
router.post('/getuser',fetchuser,async (req,res)=>{
    try{
        // if user with that id exist then returning the user details without pass hash
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.status(200).send(user);
    }
    catch(error){
        //console.log(error)
        res.status(500).json({error:"Internal server Error"})
    }
})

module.exports = router;