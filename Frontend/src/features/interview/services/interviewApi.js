import axios from "axios" 



/**
 * @description Service to generate interview reports based on self description, job description and resume 
 */
export async function generateInterviewReport({jobDescription, selfDescription, resumeFile}){


    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    if(selfDescription)formData.append("selfDescription", selfDescription)
    if(resumeFile) formData.append("resume", resumeFile)
    

    try{
            const response = await axios.post("http://localhost:3000/api/interview/", formData, {
                            withCredentials: true,
                            headers:{
                                "Content-Type" : "multipart/form-data"
                            }
                        })
            return response.data
        }catch(err){
            console.log(err)
        }

}




/**
 * @description Service to fetch the interview report using intervew ID 
 */
export async function getInterviewReportById(interviewId){
    try{
        const response = await axios.get(`http://localhost:3000/api/interview/report/${interviewId}`, {
            withCredentials: true
        })

        return response.data
    }catch(err){
        console.log(err)
    }
}




/**
 * @description Service to fetch all the interview reports of an user
 */
export async function getAllInterviewReports(){
    try{
        const response = await axios.get("http://localhost:3000/api/interview/reports", {
            withCredentials: true
        })
        return response.data
    }catch(err){
        console.log(err)
    }
}





/**
 * @description Service to generate resume pdf based on user self description, job description and resume 
 */
export async function generateResumePdf({interviewId}){

    try{
        const response = await axios.post(`http://localhost:3000/api/interview/resume/pdf/${interviewId}`, {},{
            withCredentials: true,
            responseType: "blob"
        })
        return response.data
    }catch(err){
        console.log(err)
    }

}

