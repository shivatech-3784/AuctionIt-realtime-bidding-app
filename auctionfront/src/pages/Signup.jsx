import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";
import AxiosInstance from "../utils/ApiConfig.js";

export default function SignUp() {
  const { fetchUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await AxiosInstance.post("/users/signup", formData);
      await fetchUser();
      navigate("/");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "An error occurred"
      );
    }
  };

  // ✅ GOOGLE SIGNUP / LOGIN
  const handleGoogleLogin = () => {
    window.location.href =
      "https://auctionit-realtime-bidding-app.onrender.com/api/v1/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 border border-yellow-300 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
          Create an Account
        </h2>

        {errorMessage && (
          <div className="text-red-600 text-sm text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* EMAIL SIGNUP */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-2.5 rounded-xl text-lg font-medium"
          >
            Sign Up
          </button>
        </form>

        {/* GOOGLE SIGNUP */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 border border-gray-300 bg-white text-gray-700 py-2.5 rounded-xl text-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
