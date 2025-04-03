const { asyncHandler,ApiError } = require("../utils");
const bcrypt=require('bcrypt');
const userModel=require('../model/user');
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