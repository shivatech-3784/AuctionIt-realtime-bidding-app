import User from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generateaccessandrefreshtokens = async(userId)=>{
    const user = await User.findById(userId);
    if (!user) {
        throw new apierror(404, "User not found");
    }
    const accessToken = user.createaccesstoken();
    const refreshToken = user.createrefreshtoken();
    return { accessToken, refreshToken };
}
const registeruser = asynchandler(async(req , res) =>{
    const { username, email, password } = req.body;

    if (!username || !email  || !password) {
        throw new apierror(400, "All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new apierror(400, "User already exists with this email");
    }
    const avatarlocalpath = req.file?.path;
    let avatarurl = "";
    if (avatarlocalpath) {
        const avatarobj = await uploadToCloudinary(avatarlocalpath);
        if (!avatarobj) {
            throw new apierror(500, "Failed to upload avatar to Cloudinary");
        }
        avatarurl = avatarobj.url;
    } else {
        avatarurl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }
    if (!avatarurl) {
        throw new apierror(400, "Avatar is required");
    }
    const newUser = await User.create({
        username,
        email,
        password
    });
    if (!newUser) {
        throw new apierror(500, "Failed to create user");
    }
    const { accessToken, refreshToken } = await generateaccessandrefreshtokens(newUser._id);
    newUser.refreshtoken = refreshToken;

    const saveduser = await User.findById(newUser._id).select("-password -refreshtoken");
    if (!saveduser) {
        throw new apierror(500, "Failed to retrieve saved user");
    }

    return res
    .status(200)
    .json(
        new apiresponse(200, {
            user: saveduser,
            accessToken,
            refreshToken
        }, "User registered successfully")
    );
})

const Loginuser = asynchandler(async(req, res) => {
    const {  email, password } = req.body;

    if (!email ) {
        throw new apierror(400, "Email or username is required");
    }

    const user = await User.findOne(
        {
        $or:[{ email }]
        }
    );

    if (!user) {
        throw new apierror(404, "User not found in controller");
    }

    const isPasswordCorrect = await user.ispasswordcorrect(password);
    if (!isPasswordCorrect) {
        throw new apierror(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateaccessandrefreshtokens(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000
    };
    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .json(
            new apiresponse(200, {
                user: user,
                accessToken,
                refreshToken
            }, "User logged in successfully")
        );
});
const Logoutuser = asynchandler(async(req, res) => {
    const user = req.user; 
    await User.findByIdAndUpdate(user._id,{
        $set:{
            refreshtoken: null,
        }
    });
    if (!user) {
        throw new apierror(404, "User not found");
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000
    };
    return res
        .status(200)
        .clearCookie("accesstoken",  options)
        .clearCookie("refreshtoken",  options)
        .json(
            new apiresponse(200, null, "User logged out successfully")
        );
});

const getuserdetails = asynchandler(async(req, res) => {
    const user = req.user;
    if (!user) {
        throw new apierror(404, "User not found");
    }
    const userdetails = await User.findById(user._id).select("-password -refreshtoken");
    if (!userdetails) {
        throw new apierror(404, "User details not found");
    }
    return res
        .status(200)
        .json(
            new apiresponse(200, userdetails, "User details retrieved successfully")
        );
});

const getuserbyid = asynchandler(async(req, res) => {
    const userId = req.params.id;
    if (!userId) {
        throw new apierror(400, "User ID is required");
    }
    const user = await User.findById(userId).select("-password -refreshtoken");
    if (!user) {   
        throw new apierror(404, "User not found");
    }   
    return res
        .status(200)
        .json(
            new apiresponse(200, user, "User retrieved successfully")
        );
});

const getallusers = asynchandler(async (req, res) => {
    const users = await User.find().select("-password -refreshtoken").lean();

    if (users.length === 0) {
        throw new apierror(404, "No users found");
    }

    return res.status(200).json(
        new apiresponse(200, users, "Users retrieved successfully")
    );
});

export {
    registeruser,
    Loginuser,
    Logoutuser,
    getuserdetails,
    getuserbyid,
    getallusers
}