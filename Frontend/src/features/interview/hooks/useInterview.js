import { useContext, useEffect } from "react"
import {generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf} from "../services/interviewApi"
import {InterviewContext} from "../services/interviewContext"
import { useParams } from "react-router"

export const useInterview = ()=>{
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()


    if(!context){
        throw new Error("useInterview must be within InterviewProvider")
    }


    const {loading, setLoading, report, setReport, reports, setReports} = context


    const generateReport = async({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true)
        
        try{
            const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            if(!response) return null
            setReport(response.interviewReport)
            return response.interviewReport
            
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        
    }

    const getReportById =  async(interviewId)=>{
        setLoading(true)
        
        try{
            const response = await getInterviewReportById(interviewId)
            if(!response) return null
            setReport(response.interviewReport)
            return response.interviewReport
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        
    }


    const getAllReports = async()=>{
        setLoading(true)
        
        try{
            const response = await getAllInterviewReports()
            if(!response) return null
            setReports(response.interviewReports)
            return response.interviewReports
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        
    }



    const getResumePdf = async(interviewId)=>{
        setLoading(true)
        try{
            const response = await generateResumePdf({interviewId})
            if(!response) return null
            const url = window.URL.createObjectURL(new Blob([response], {type : "application/pdf"}))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }

    }



    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        } else{
            getAllReports()
        }
    }, [interviewId])


    return {generateReport, getReportById, getAllReports, getResumePdf ,loading, report, reports}

}



