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
      // console.error(err.response?.data?.message || err.message);
      setErrorMessage(err.response?.data.message || err.message || "An error occurred");
    }
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
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300"
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
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300"
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
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300"
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
              placeholder="Confirm your password"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-2.5 rounded-xl text-lg font-medium transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
