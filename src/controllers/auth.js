const { asyncHandler,ApiError } = require("../utils");
const bcrypt=require('bcrypt');
const userModel=require('../model/user');
const { default:arcjet, validateEmail } = require("@arcjet/node");

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }
  const token = user.getJwtToken();
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
  });
});

const signup=asyncHandler(async(req,res)=>{
  const {name,email,password}=req.body;
  const decision = await aj.protect(req, {
    email: req.body.email,
  });
  if (decision.isDenied()) {
    console.log("email denied brother")
    throw new ApiError(400, "Invalid email");
  }

    const findUser=await userModel.findOne({email});
    if(findUser){
        throw new ApiError(400,"User already exists");
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await userModel.create({
        name,
        email,
        password:hashedPassword
    });
    const token=user.getJwtToken();
    res.status(201).json({
        success:true,
        message:"User created successfully",
        token
    });

})

module.exports = {
    login,
    signup
}