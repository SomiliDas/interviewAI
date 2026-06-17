const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/interviewReportModel")
const {generateInterviewReport, generateResumePdf} = require("../services/aiService")





/**
 * @description Controller to generate interview report based on user self description, job description and reume 
 */
const generateInterviewReportController = async(req, res)=>{
    const resumeFile = req.file
    
    const {jobDescription} = req.body


    let selfDescription=""
    if(req.body.selfDescription){
        selfDescription = req.body.selfDescription
    }
    

    let resumeText = ""
    if(req.file){
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeText = resumeContent.text
    }

     if(!resume && !selfDescription){
            return res.status(400).json({
                message : "Either a resume or a self description is required"
            })
        }


    
    const interviewReportByAI = await generateInterviewReport({
        resume : resumeText, 
        jobDescription,
        selfDescription

    })

    const interviewReport = await interviewReportModel.create({
        jobDescription,
        resume : resumeText,
        selfDescription,
        matchScore : interviewReportByAI.matchScore,
        technicalQuestions : interviewReportByAI.technicalQuestions,
        behaviouralQuestions : interviewReportByAI.behaviouralQuestions,
        skillGap : interviewReportByAI.skillGap,
        preparationPlan : interviewReportByAI.preparationPlan,
        user: req.user.id,
        title : interviewReportByAI.title
    })

    res.status(201).json({
        message : "interview report created",
        interviewReport
    })

}




/**
 * @description Controller to get interview report by ID
 */
const getInterviewReportById = async(req, res)=>{
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id : interviewId, user: req.user.id})
    if(!interviewReport){
        return res.status(404).json({
            message : "Interview report not found"
        })
    }
    return res.status(200).json({
        message : "Interview report fetched successfully",
        interviewReport
    })
}



/**
 * @description Controller to get all the interview reports of a user
 */
const getAllInterviewReports = async(req, res)=>{
    const userId = req.user.id
    const interviewReports = await interviewReportModel.find({user : userId}).sort({createdAt : -1}).select("-jobDescription -selfDescription -resume -technicalQuestions -behaviouralQuestions -skillGap -preparationPlan -user -_v" )
    if(interviewReports.length == 0){
        return res.status(404).json({
            message : "Intrview reports not found"
        })
    }
    return res.status(200).json({
        message : "Interview reports fetched successfully",
        interviewReports
    })
}




/**
 * @description Controller to generate resume PDF based on user self description, resume and job description
 */
const generateResumePdfController = async(req, res)=>{
        const {interviewId} = req.params
        const interviewReport = await interviewReportModel.findById(interviewId)
        if(!interviewReport){
            return res.status(404).json({
                message : "Interview report not found"
            })
        }
        let resume =""
        if(interviewReport.resume){
            resume = interviewReport.resume
        }
        
        let selfDescription = ""
        if(interviewReport.selfDescription){
            selfDescription = interviewReport.selfDescription
        }
        
        if(!resume && !selfDescription){
            return res.status(400).json({
                message : "Either a resume or a self description is required"
            })
        }
        const {jobDescription} = interviewReport


        const pdfBuffer = await generateResumePdf({jobDescription, selfDescription, resume})

        res.set({
            "Content-Type" : "application/pdf",
            "Content-Disposition" : `attachment; filename=resume_${interviewId}.pdf`
        })

        return res.send(pdfBuffer)
}

module.exports = {generateInterviewReportController, getInterviewReportById, getAllInterviewReports, generateResumePdfController}