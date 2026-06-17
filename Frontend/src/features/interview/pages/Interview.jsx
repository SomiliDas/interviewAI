import { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview'
import { useParams } from 'react-router'
import Loading from '../../components/Loading'



const Interview = () => {
    const [activeSection, setActiveSection] = useState('technical')
    const [expandedQuestions, setExpandedQuestions] = useState({})
    const {report, getReportById, loading, getResumePdf} = useInterview()
    const {interviewId} = useParams()


    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }
    }, [interviewId])


    if(loading || !report){
        return (
            <Loading/>
        )
    }


    // Helper functions
    const toggleQuestion = (id) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const renderQuestionCard = (question, index) => (
        <div key={index} className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden mb-4">
            <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 flex items-start justify-between hover:bg-slate-800/60 transition-colors"
            >
                <div className="flex items-start gap-4 flex-1 text-left">
                    <div className="flex-shrink-0 mt-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-pink-500/20 text-pink-400 font-semibold text-sm">
                            {index + 1}
                        </span>
                    </div>
                    <h3 className="text-white font-medium leading-relaxed">{question.questions}</h3>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${expandedQuestions[index] ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </button>

            {expandedQuestions[index] && (
                <div className="px-6 py-4 border-t border-slate-700/30 bg-slate-900/30 space-y-4">
                    {question.intention && (
                        <div>
                            <p className="text-xs uppercase font-semibold text-pink-400 mb-2">Intention</p>
                            <p className="text-slate-300 text-sm">{question.intention}</p>
                        </div>
                    )}
                    {question.answer && (
                        <div>
                            <p className="text-xs uppercase font-semibold text-green-400 mb-2">Model Answer</p>
                            <p className="text-slate-300 text-sm">{question.answer}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )

    const renderTechnicalSection = () => (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Technical Questions</h2>
                <p className="text-pink-400 text-sm">{report.technicalQuestions.length || 0} questions</p>
            </div>
            {report.technicalQuestions.map(renderQuestionCard)}
        </div>
    )

    const renderBehaviouralSection = () => (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Behavioural Questions</h2>
                <p className="text-pink-400 text-sm">{report.behaviouralQuestions.length || 0} questions</p>
            </div>
            {report.behaviouralQuestions.map(renderQuestionCard)}
        </div>
    )

    const renderRoadMapSection = () => (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Preparation Road Map</h2>
                <p className="text-pink-400 text-sm">{report.preparationPlan.length}-day plan</p>
            </div>
            <div className="space-y-8">
                {report.preparationPlan.map((dayPlan, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-pink-500 rounded-full border-2 border-pink-500 relative z-10"></div>
                            {index !== report.preparationPlan.length - 1 && (
                                <div className="w-0.5 h-24 bg-pink-500/30 mt-2"></div>
                            )}
                        </div>
                        <div className="pb-8 flex-1">
                            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-pink-400 uppercase bg-pink-500/10 px-2 py-1 rounded">
                                        {dayPlan.day}
                                    </span>
                                    <h3 className="text-white font-semibold">{dayPlan.focus}</h3>
                                </div>
                                <ul className="space-y-2 ml-0">
                                    {dayPlan.tasks.map((task, taskIndex) => (
                                        <li key={taskIndex} className="text-slate-300 text-sm flex gap-2">
                                            <span className="text-slate-500">•</span>
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderSkillGaps = () => (
        <div>
            {report.skillGap.map((gap, index) => (
                <div
                    key={index}
                    className={`text-xs px-3 py-2 rounded border text-white mb-2 ${
                        gap.severity === 'high'
                            ? 'bg-red-500/10 border-red-500/30'
                            : gap.severity === 'medium'
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : 'bg-green-500/10 border-green-500/30'
                    }`}
                >
                    {gap.skill}
                </div>
            ))}
        </div>
    )

    return (
        <main className="min-h-screen  py-14">
            <div className="pt-6 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Main Layout - 3 columns */}
                    <div className="grid grid-cols-12 gap-6 pb-12">

                        {/* Left Sidebar - Navigation */}
                        <div className="col-span-12 lg:col-span-2">
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 sticky top-6 h-fit">
                                <p className="text-xs uppercase font-semibold text-pink-400 mb-4">Sections</p>
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => setActiveSection('technical')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm flex items-center gap-2 ${
                                            activeSection === 'technical'
                                                ? 'bg-pink-500/10 text-pink-400 border-l-2 border-pink-500'
                                                : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                    >
                                        <span className="text-lg">▶</span>
                                        Technical Questions
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('behavioural')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm flex items-center gap-2 ${
                                            activeSection === 'behavioural'
                                                ? 'bg-pink-500/10 text-pink-400 border-l-2 border-pink-500'
                                                : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                    >
                                        <span className="text-lg">📋</span>
                                        Behavioural Questions
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('roadmap')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm flex items-center gap-2 ${
                                            activeSection === 'roadmap'
                                                ? 'bg-pink-500/10 text-pink-400 border-l-2 border-pink-500'
                                                : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                    >
                                        <span className="text-lg">🗺</span>
                                        Road Map
                                    </button>

                                    <button onClick={()=>{getResumePdf(interviewId)}} className="w-full text-left px-4 py-3 rounded-lg transition-all text-sm flex items-center gap-2 text-pink-400 hover:text-slate-300 hover:bg-slate-700/30 border border-slate-700/50 mt-4">
                                        <span className="text-lg">✨</span>
                                        Download Resume
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Center - Main Content */}
                        <div className="col-span-12 lg:col-span-7">
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
                                {activeSection === 'technical' && renderTechnicalSection()}
                                {activeSection === 'behavioural' && renderBehaviouralSection()}
                                {activeSection === 'roadmap' && renderRoadMapSection()}
                            </div>
                        </div>

                        {/* Right Sidebar - Score & Skill Gaps */}
                        <div className="col-span-12 lg:col-span-3">
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 sticky top-6 h-fit">
                                <h3 className="text-pink-400 text-xs uppercase font-semibold mb-6">Match Score</h3>
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center mb-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">{report.matchScore}</div>
                                            <div className="text-xs text-slate-400">%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-700/30 pt-6">
                                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <div className="w-3 h-3 bg-pink-500 rounded-sm"></div>
                                        Skill Gaps
                                    </h4>
                                    {renderSkillGaps()}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    )
}

export default Interview
