import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";
import AxiosInstance from "../utils/ApiConfig.js";

export default function SignIn() {
  const { fetchUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosInstance.post("/users/login", formData);
      await fetchUser();
      navigate("/");
    } catch (err) {
      // console.error(err.response?.data.message || err.message);
      setErrorMessage(err.response?.data.message || err.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 border border-yellow-300 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
          Welcome Back
        </h2>

        {errorMessage && (
          <div className="text-red-600 text-sm text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-2.5 rounded-xl text-lg font-medium transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          New to AuctionIt?{" "}
          <Link
            to="/SignUp"
            className="text-yellow-700 font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
