const mongoose = require("mongoose")


/**
 * Interview Report Schema 
 *  -Job Description schema : String,
 *  -Resume text : String,
 *  -Self Descrription : String,
 *  -matchScore : Number,
 * 
 * 
 *  -Technical questions : 
 *      [{
 *          question : "",
 *          intenton : "",
 *          answer : ""
 *       }]
 *  -Behavioural questions : 
 *       [{
 *          question : "",
 *          intenton : "",
 *          answer : ""
 *       }]
 *  -Skill gaps : 
 *      [{
 *          skill : "",
 *          severity : {
 *              type : "",
 *              enum : ["low", "medium", "high"]
 *          }
 *      }]
 *  -peparation plan : [{
 * 
 *          day : Number,
 *          focus : string,
 *          tasks : [string]
 * 
 *  }]
 * 
 */


const technicalQuestionSchema = new mongoose.Schema({
   questions : {
    type : String,
    required : true,
   },
   intention : {
    type : String,
    required : true
   },
   answer : {
    type : String,
    required : true
   }
}, {
    _id : false
})



const behaviouralQuestionSchema = new mongoose.Schema({
    questions : {
    type : String,
    required : true
   },
   intention : {
    type : String,
    required : true
   },
   answer : {
    type : String,
    required : true
   }
}, {
    _id : false
})


const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : true
    },
    severity : {
        type : String,
        enum : ["low", "medium", "high"],
        required : true
    }
}, {
    _id:false
})



const preparationPlanSchema = new mongoose.Schema({
    day : {
        type : Number,
        required : true
    },
    focus : {
        type : String,
        required : true,
    },
    tasks : [
        {
            type: String,
            required : true
        }
    ]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : [true, "Job Description is required"]
    },
    resume : {
        type : String
    },
    selfDescription : {
        type : String
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100,
        required : true
    },
    technicalQuestions : [technicalQuestionSchema],
    behaviouralQuestions : [behaviouralQuestionSchema],
    skillGap : [skillGapSchema],
    preparationPlan : [preparationPlanSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    title : {
        type : String,
        required: true
    }

    
}, {
    timestamps : true
})


const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema)

module.exports = interviewReportModel
