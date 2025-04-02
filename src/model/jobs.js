const {Schema,model}=require('mongoose');
const userModel = require('./user');
const JobSchema = new Schema({
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (id) {
        const user = userModel.findById(id);
        return user && user.role === "recruiter";
      },
      message: "Recruiter ID is invalid or does not have recruiter role",
    },
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 500,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  skills:{
    type: [String],
    required: true,
    validate: {
      validator: function (skills) {
        return skills.length >= 1;
      },
      message: "Skills must have at least 1 skills",
    }
  },
  experienceLevel:{
    type: String,
    required: true,
  },
  salary:{
    type: Number,
    required: true,
  },
},{
    timestamps:true,
});

module.exports = model('Job', JobSchema);