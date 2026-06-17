const userModel = require("../models/userModel")
const blackListModel = require("../models/blacklistModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")





/**
 * @route POST  /api/auth/register
 * @description Register new users, expects username, email and password
 * @access Public
 */
const registerUserController = async (req, res)=>{
    try{
        let {username, email, password} = req.body
         if(!username || !email || !password){
            return res.status(400).json({
                message : "Please provide username, email and password"
            })
         }
        const userAlreadyExist = await userModel.findOne({
            $or : [{username}, {email}]
        })
        if(userAlreadyExist){
            return res.status(400).json({
                message : "Account already exists"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password : hash
        })


        const token = jwt.sign({
            id : user._id,
            username : user.username
        }, process.env.JWT_SECRET, {expiresIn : "7d"})

        res.cookie("token", token)


        return res.status(201).json({
            message : "user created",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })
    }catch(err){
        console.log(err)
    }
}



/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
const loginUserController = async (req, res)=>{
    try{
        let {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message : "Please provide email and password"
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(401).json({
                message : "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message : "Invalid email or password"})
        }

        const token = jwt.sign({
            id : user._id,
            username : user.username
        } ,process.env.JWT_SECRET,
        {expiresIn : "7d"}
        )

        res.cookie("token", token)
            
        return res.status(200).json({
            message : "user logged in successfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })
    }catch(err){
        console.log(err)
    }

}





/**
 * @route GET /api/auth/logout
 * @description Clear token from user cookie and add the token in blacklist
 * @access Public
 */
const logoutUserController = async (req, res)=>{
    let token = req.cookies.token
    if(token){
        await blackListModel.create({
            token
        })
    }
    res.clearCookie("token");

    return res.status(200).json({
        message : "logout successful"
    })

}






/**
 * @route GET  /api/auth/get-me
 * @description Gives the details of the loggedin user
 * @access Private
 */
const getMeController = async (req, res)=>{
    const user = await userModel.findById(req.user.id)
    return res.status(200).json({
        message : "User fetched",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
    
    
}


module.exports = {registerUserController, loginUserController, logoutUserController, getMeController}