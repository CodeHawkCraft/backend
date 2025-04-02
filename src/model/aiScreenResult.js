
const {Schema,model}=require('mongoose');

const AiScreenResultSchema = new Schema({
    applicationId:{
        type: Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    aiDecision:{
        type:String,
        required:true,
        enum:['weak','moderate','strong']
    },
    feedback:{
        type:String,
        required:true,
    }
})

module.exports = model('AiScreenResult',AiScreenResultSchema);