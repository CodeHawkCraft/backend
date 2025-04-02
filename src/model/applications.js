const {Schema,model}=require('mongoose');
const userModel = require('./user');
const ApplicationSchema = new Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    candidateId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async function (value) {
                const user = await userModel.findById(value);
                return user && user.role === "user";
            },
            message: "Candidate ID is invalid or does not have candidate role",
        },
    },
    resume:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        required: true,
        trim: true,
        enum: ['applied', 'screened', 'shortlisted'],
        default: 'applied'
    },
    aiScore:{
        type: Number,
        required:true
    }
})

module.exports = model('Application',ApplicationSchema);