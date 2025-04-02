const { Schema, model } = require("mongoose");
const userModel = require("./user");

const CompanySchema = new Schema({
  orgName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  orgEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  recruiters: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: {
      validator: async function (recruiterIds) {
        if (!Array.isArray(recruiterIds)) return false;

        for (const userId of recruiterIds) {
          const user = await userModel.findById(userId);
          if (!user || user.role !== "recruiter") {
            return false;
          }
        }
        return true;
      },
      message:
        'Only users with the role "recruiter" can be added as recruiters.',
    },
  },
},{
  timestamps: true,
});

module.exports = model("Company", CompanySchema);
