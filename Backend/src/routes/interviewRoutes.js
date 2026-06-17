const {Router} = require("express");
const authUser = require("../middlewares/authMiddleware")
const upload = require("../middlewares/fileMiddleware")
const {generateInterviewReportController, getInterviewReportById, getAllInterviewReports, generateResumePdfController} = require("../controllers/interviewController")


const interviewRouter = Router()



/**
 * @route POST  /api/interview/
 * @description Generate new interview report on the basis of user self description, resume pdf and job description
 * @access Private
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReportController )




/**
 * @route GET   /api/interview/report/:interviewId
 * @description Gets the interview by the interview ID
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportById )




/**
 * @route  GET   /api/interview/reports
 * @description Gets all the interview reports of a person by user ID
 * @access Private
 */
interviewRouter.get("/reports", authUser, getAllInterviewReports)





/**
 * @route POST  /api/interview/resume/pdf/:interviewId
 * @description Generates resume PDF based on user self description, job description and resume
 * @access Private
 */
interviewRouter.post("/resume/pdf/:interviewId", authUser, generateResumePdfController)




module.exports = interviewRouter