const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
            username : {
                type : String,
                unique : [true, "username already taken"],
                reuired : true
            },
            email : {
                type : String,
                unique : [true, "account already exists with this email address"],
                reuired : true
            },
            password : {
                type :String,
                required : true
            }
    }
)


const userModel = mongoose.model("user", userSchema)

module.exports = userModel