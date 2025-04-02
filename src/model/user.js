const {Schema,model}=require('mongoose');

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minlength: 8,
    },
    phone:{
        type:String,
    },
    role:{
        type: String,
        enum: ['admin', 'user', 'recruiter'],
        default: 'user'
    },
    authProvider:{
        type: String,
        enum: ['google', 'linkedin'],
        default: null 
    },
},{
    timestamps:true,
});


module.exports = model('User', UserSchema);