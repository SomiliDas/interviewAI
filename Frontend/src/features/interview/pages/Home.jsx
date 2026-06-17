import { useNavigate } from "react-router";
import {useInterview} from "../hooks/useInterview"
import { useRef, useState } from 'react';
import Loading from "../../components/Loading";
import {toast } from 'react-toastify';

const Home = () => {

    const {loading, generateReport, reports} = useInterview()

    const navigate = useNavigate()
    
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null)



    const handleUploadClick = () => {
        resumeInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file)
            console.log('Selected file:', file.name);
        }
    };


    const handleGenerateReport = async()=>{
        const resumeFile = resumeInputRef.current.files[0]
        if(!jobDescription || jobDescription.length == 0){
            console.log("Providing a job description is necessary")
            toast.error("Job Description Required")
            return
        }
        if(selfDescription.length==0 && !resumeFile){
            console.log("Either a resume or a self description must be uploaded")
            toast.error("Either a self description or a resume is required")
            return
        }
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        if (!data) {
            console.error("Failed to generate report")
            return
        }
        navigate(`/interview/${data._id}`)
    }

    



    if(loading){
        return(
            <Loading/>
        )
    }

  return (
  
  <main className="min-h-screen">
      
      
      {/* Header */}
            <div className="pt-16 pb-12 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Create Your Custom{" "}
                <span className="text-pink-500">Interview</span>{" "}
                <span className="text-purple-400">Plan</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Let our AI analyze the job requirements and your unique profile to build a
                winning strategy.
                </p>
            </div>

      {/* Main Content */}
            <div className="px-6 pb-15 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Target Job Description */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-sm"></div>
                        <h2 className="text-white font-semibold">Target Job Description</h2>
                    </div>
                    <span className="text-xs text-slate-400">Required</span>
                    </div>

                    <textarea
                    
                    placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"

                    value={jobDescription}
                    onChange={(e)=>{setJobDescription(e.target.value)}}

                    className="w-full h-64 bg-slate-900/50 border border-slate-700/30 rounded-lg p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                    />

                    
                </div>

                {/* Your Profile */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <h2 className="text-white font-semibold">Your Profile</h2>
                    </div>
                    </div>

                    {/* Upload Resume */}
                    <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm text-slate-300">Upload Resume</label>
                        
                    </div>

                    <div
                        onClick={handleUploadClick}
                        className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500/70 transition-colors"
                    >
                        <div className="flex flex-col items-center">
                        <svg
                            className="w-12 h-12 text-pink-500 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        {
                            selectedFile? (
                                <div>
                                    <p className="text-green-400 font-semibold"> ✓ {selectedFile.name} </p>
                                </div>

                            ) : (
                                <div>
                                    <p className="text-sm text-slate-400">Click to upload or drag & drop</p>
                                    <p className="text-xs text-slate-500 mt-1">(PDF 3MB)</p>
                                </div>
                            )
                        }
                        </div>
                    </div>

                    <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-slate-700/30"></div>
                    <span className="text-xs text-slate-500 uppercase">or</span>
                    <div className="flex-1 h-px bg-slate-700/30"></div>
                    </div>

                    {/* Quick Self-Description */}
                    <div className="mb-4">
                    <label className="text-sm text-slate-300">Quick Self-Description</label>

                    <textarea
                        
                        
                        placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."


                        value={selfDescription}
                        onChange={(e)=>{setSelfDescription(e.target.value)}}


                        className="w-full h-24 bg-slate-900/50 border border-slate-700/30 rounded-lg p-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none mt-2"
                    />
                    </div>

                    {/* Requirements Note */}
                    <div className="bg-slate-900/30 border border-blue-500/20 rounded-lg p-3 text-xs text-slate-300">
                    <div className="flex gap-2">
                        <svg
                        className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                        </svg>
                        <span>
                        Either a <span className="text-white font-semibold">Resume</span> or a{" "}
                        <span className="text-white font-semibold">Self-Description</span> is
                        required to generate a personalized plan.
                        </span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Generate Button Section */}
                <div className="flex flex-col items-center gap-4">
                

                <button
                    
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-pink-500/50"


                    onClick={handleGenerateReport}


                >
                    ✨ Generate My Interview Strategy
                </button>
                </div>
            </div>


      {/* Recent Reports List */}
        {
            reports.length > 0 && (
                <div className="px-6 max-w-6xl mx-auto w-full mb-16">
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-slate-700/30 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-400 rounded-full"></div>
                                <h2 className="text-white font-bold text-2xl">My Recent Interview Plans</h2>
                                <span className="ml-auto text-sm font-medium text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">{reports.length} {reports.length === 1 ? 'plan' : 'plans'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {
                                reports.map((report, index)=>(
                                    <div
                                        key={report._id}
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                        className="group relative bg-slate-900/40 border border-slate-700/60 hover:border-pink-500/40 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer hover:bg-slate-900/60 hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 rounded-lg transition-all duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-lg font-semibold text-pink-400">
                                                        {index + 1}
                                                    </div>
                                                    <svg className="w-5 h-5 text-slate-500 group-hover:text-pink-400 transition-colors opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                                <div className="text-pink-400"><span className="text-slate-400 font-semibold">Match Score : </span>{report.matchScore}%</div>
                                            </div>
                                            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-pink-300 transition-colors">{report.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 107.753-1 4.5 4.5 0 11-4.384 5.98z" />
                                                </svg>
                                                <span>Click to view</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            )
        }

    </main>)
}

export default Home
