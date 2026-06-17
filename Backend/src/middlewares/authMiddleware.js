const jwt = require("jsonwebtoken")
const blackListModel = require("../models/blacklistModel")

const authUser = async (req, res, next)=>{

    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message : "token not provided"
        })
    }

    const tokenBlackListed = await blackListModel.findOne({token})
    if(tokenBlackListed){
        return res.status(401).json({
            message : "Invalid Token"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({
            message : "Invalid Token"
        })
    }

}

module.exports = authUser
