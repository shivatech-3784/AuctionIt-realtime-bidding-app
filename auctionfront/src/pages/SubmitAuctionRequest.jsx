import React, { useState, useContext, useEffect } from "react";
import AxiosInstance from "../utils/ApiConfig.js";
import UserContext from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const SubmitAuctionRequest = () => {
  const { user, userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/signin");
    }
  }, [user, userLoading, navigate]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseprice: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in to submit a request");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("baseprice", formData.baseprice);
    payload.append("image", formData.image);
    payload.append("requestedby", user._id);
    payload.append("status", "pending");

    try {
      setLoading(true);
      await AxiosInstance.post("/auctionrequests/submit-request", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      // console.error(err);
      setError("Failed to submit auction request");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-4 relative">
      {showSuccess && (
        <div className="absolute top-6 z-50 bg-yellow-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          Auction request submitted successfully!
        </div>
      )}

      <div className="w-full max-w-lg backdrop-blur-lg bg-white/70 border border-yellow-300 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">
          Submit Auction Request
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item Name"
              required
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Item Description"
              required
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 h-28 resize-none focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Base Price (₹)
            </label>
            <input
              type="number"
              name="baseprice"
              value={formData.baseprice}
              onChange={handleChange}
              placeholder="Base Price"
              required
              className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-800 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required
              className="w-full px-3 py-1 border border-yellow-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-400 transition"
            />
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Preview:
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-yellow-200 shadow"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-2.5 rounded-xl text-lg font-medium transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAuctionRequest;
