const {GoogleGenAI} = require("@google/genai");
const {z}= require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema")
const puppeteer = require("puppeteer")



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate's resume and the job description, on a scale of 0 to 100, indicating how well the candidate's skills and experience align with the requirements of the job"),
    technicalQuestions: z.array(z.object({
        questions: z.string().describe("The technical question that can be asked in the interview by the interviewer"),
        intention : z.string().describe("The intention behind asking the question"),
        answer: z.string().describe("The expected sample answer to the question, having what points to cover, approach to take etc.")
    })).describe("A list of technical questions that can be asked in the interview, along with their intention and expected sample answer"),
    behaviouralQuestions: z.array(z.object({
        questions: z.string().describe("The behavioral question that can be asked in the interview by the interviewer"),
        intention : z.string().describe("The intention behind asking the question"),
        answer: z.string().describe("The expected sample answer to the question, having what points to cover, approach to take etc.")
    })).describe("A list of behavioral questions that can be asked in the interview, along with their intention and expected sample answer"),
    skillGap: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking in"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, can be low, medium or high")    
    })).describe("A list of skill gaps that the candidate has, along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe("The focus area for that day, can be a skill or a topic to cover. For example, if the candidate has a skill gap in React, the focus for that day can be 'React Basics' or 'React Hooks' etc."),
        tasks: z.array(z.string()).describe("The list of tasks to be completed on that day")
    })).describe("A preparation plan for the candidate to improve their skills and prepare for the interview, broken down by day and tasks to be completed on that day"),
    title: z.string().describe("The title of the job for which the interview report is generated.")


})



async function generateInterviewReport({resume, selfDescription, jobDescription}){


    const prompt = `You are an expert technical recruiter and career coach. Analyze the candidate's resume and self-description against the job description provided.
        Your task is to return a SINGLE valid JSON object — no markdown, no explanation, no code fences. Just raw JSON.
        The JSON must follow this exact schema:

{
  "matchScore": <integer 0-100 representing how well the candidate matches the job>,
  "technicalQuestions": [
    {
      "questions": "<interview question tailored to the Job description and candidate's background>",
      "intention": "<what this question is meant to evaluate>",
      "answer": "<ideal answer the interviewer expects>"
    }
    // Provide exactly 5 technical questions
  ],
  "behaviouralQuestions": [
    {
      "questions": "<behavioral interview question>",
      "intention": "<what this question is meant to evaluate>",
      "answer": "<ideal answer>"
    }
    // Provide exactly 3 behavioral questions
  ],
  "skillGap": [
    {
      "skill": "<skill name missing or weak based on JD vs resume>",
      "severity": "<'low' | 'medium' | 'high'>"
    }
    // List all identified skill gaps
  ],
  "preparationPlan": [
    {
      "day": <day number starting from 1>,
      "focus": "<the main topic for the day>",
      "tasks": [
        "<specific actionable task>",
        "<specific actionable task>",
        "<specific actionable task>"
      ]
    }
    // Provide a 10-day plan
  ],
  "title": "<the title of the job for which the interview report is generated>"
}

--- JOB DESCRIPTION ---
${jobDescription}

--- CANDIDATE SELF DESCRIPTION ---
${selfDescription}

--- CANDIDATE RESUME ---
${resume}

Return only the JSON object. Do not include any other text.`





    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config:{
            responseMimeType:"application/json",
            responseJSONSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text)
}


async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox"
  ]
});
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', margin:{
      top : "15mm",
      bottom: "15mm",
      left: "15mm",
      right: "15mm"
    }
   });

    await browser.close();

    return pdfBuffer;
}


async function generateResumePdf({resume, selfDescription, jobDescription}){
    const resumePdfSchema = z.object({
      html : z.string().describe("The HTML content of the resume, which can be converted to a PDF file using a library like Puppeteer.")
    })

    const prompt = `You are an expert resume writer. Generate a resume for a candidate with the following details :
                        Resume : ${resume}
                        Self Description : ${selfDescription}
                        Job Description : ${jobDescription}
                        The resume format should be in HTML and should be well-structured, visually appealing, easy to read and ATS friendly i.e, it should be easily parsable by ATS systems without losing important informations. It should include sections such as Contact Information, Summary, Skills, Experience, Education, and any other relevant sections based on the candidate's background and the job description. 
                        The resume should be tailored to highlight the candidate's strengths and align with the requirements of the job description.
                        It should be one page long, when coverted into PDF and should fill out that page completely. So accordingly adjust the font size maintaining uniform spacing between the components .
                        The response must be visually appealing, keeping the overall design simple and professional. It should be in a format that can be easily converted to a PDF file using a library like Puppeteer.
                        The response should be a JSON object with a single key "html" containing the HTML content of the resume.
                        The HTML content should be well-formatted and structured, making it easy to read. Do not include any other text or explanation.
                        The content of resume should not sound like its generated by AI and should be as humanly written possible.
                        The font size should be appropriate, and the overall layout should be clean and organized. Spacing in between the content must be even and consistent. There should be no sudden large spaces in the content. `
                    

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config:{
            responseMimeType:"application/json",
            responseJSONSchema: zodToJsonSchema(resumePdfSchema)
        }
    })
    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}


module.exports = {generateInterviewReport , generateResumePdf}
