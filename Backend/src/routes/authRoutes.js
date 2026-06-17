const {Router} = require("express")
const {registerUserController, loginUserController, logoutUserController, getMeController} = require("../controllers/authController")
const authUser = require("../middlewares/authMiddleware")

const authRouter = Router()
/**
 * @route POST  /api/auth/register
 * @description Register new users
 * @access Public
 */
authRouter.post("/register", registerUserController )




/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/login", loginUserController)




/**
 * @route GET /api/auth/logout
 * @description Clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout", logoutUserController )




/**
 * @route GET  /api/auth/get-me
 * @description Gives the details of the loggedin user
 * @access Private
 */
authRouter.get("/get-me", authUser, getMeController)


module.exports = authRouter