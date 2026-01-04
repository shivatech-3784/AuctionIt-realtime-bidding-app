import axios from "axios";
import User from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";

export const googleAuth = (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    "&response_type=code" +
    "&scope=openid email profile" +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`;

  res.redirect(url);
};

export const googleAuthCallback = asynchandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new apierror(400, "Authorization code missing");
  }

  // 1️⃣ Exchange code for tokens
  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    }
  );

  const { access_token } = tokenRes.data;

  // 2️⃣ Get Google user profile
  const userRes = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );

  const { email, name, picture } = userRes.data;

  // 3️⃣ Find or create user
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      username: name,
      email,
      avatar: picture,
      password: "GOOGLE_AUTH" // dummy (not used)
    });
  }

  // 4️⃣ Generate JWT using your existing logic
  const accessToken = user.createaccesstoken();
  const refreshToken = user.createrefreshtoken();

  user.refreshtoken = refreshToken;
  await user.save();

  // 5️⃣ Set cookies
  res.cookie("accesstoken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  // 6️⃣ Redirect to frontend
  res.redirect(process.env.FRONTEND_URL);
});
