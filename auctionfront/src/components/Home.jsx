import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";
import AxiosInstance from "../utils/ApiConfig.js";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser, fetchUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/users/logout", {});
      setUser(null);
      navigate("/");
    } catch (error) {
      // console.error("Logout failed", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      
      <div className="w-full h-screen relative">
        <img
          src="/pexels-bentonphotocinema-1095601.webp"
          alt="auction background"
          className="w-full h-full object-cover"
        />
      </div>

      
      <nav className="w-full absolute top-0 p-5 flex justify-between items-center text-white z-20">
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-bold cursor-pointer"
        >
          AuctionIt
        </h1>

        
        <ul className="hidden md:flex space-x-6 font-bold">
          {user?.role === "admin" ? (
            <>
              <li
                onClick={() => navigate("/admin/dashboard")}
                className="hover:underline cursor-pointer"
              >
                Admin Dashboard
              </li>
              <li
                onClick={() => navigate("/admin/auctions")}
                className="hover:underline cursor-pointer"
              >
                Manage Auctions
              </li>
              <li
                onClick={() => navigate("/admin/users")}
                className="hover:underline cursor-pointer"
              >
                Manage Users
              </li>
            </>
          ) : (
            <>
              <li
                onClick={() => navigate("/active-auctions")}
                className="hover:underline cursor-pointer"
              >
                Explore Auctions
              </li>
              <li
                onClick={() => navigate("/submit-request")}
                className="hover:underline cursor-pointer"
              >
                Auction Request
              </li>
              <li
                onClick={() => navigate("/my-requests")}
                className="hover:underline cursor-pointer"
              >
                My Auction Requests
              </li>
            </>
          )}
        </ul>

        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/SignIn")}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/SignUp")}
                className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        
        <div className="md:hidden z-30" onClick={toggleMenu}>
          {menuOpen ? (
            <AiOutlineClose size={28} className="text-white" />
          ) : (
            <AiOutlineMenu size={28} className="text-white" />
          )}
        </div>
      </nav>

      
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-blue-900 bg-opacity-95 text-white flex flex-col items-start px-6 py-6 space-y-4 z-20 md:hidden">
          {user?.role === "admin" ? (
            <>
              <span
                onClick={() => {
                  navigate("/admin/dashboard");
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                Admin Dashboard
              </span>
              <span
                onClick={() => {
                  navigate("/admin/auctions");
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                Manage Auctions
              </span>
              <span
                onClick={() => {
                  navigate("/admin/users");
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                Manage Users
              </span>
            </>
          ) : (
            <>
              <span
                onClick={() => {
                  navigate("/active-auctions");
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                Explore Auctions
              </span>
              <span
                onClick={() => {
                  navigate("/submit-request");
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                Auction Request
              </span>
              <span
                onClick={() => {
                  navigate("/my-requests");
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                My Auction Requests
              </span>
            </>
          )}

          {user ? (
            <>
              <span>Hi, {user.username}</span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/SignIn");
                  toggleMenu();
                }}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/SignUp");
                  toggleMenu();
                }}
                className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}

      
      <div className="absolute top-0 h-screen flex flex-col space-y-10 justify-center items-center bg-opacity-100 xl:w-1/3 sm:w-1/2 z-10 px-4 text-center">
        <div className="text-center space-y-5 px-5">
          <h2 className="text-2xl font-bold tracking-widest text-white">
            WELCOME TO
          </h2>
          <h1 className="text-5xl font-extrabold text-white">AuctionIt</h1>
          <p className="text-gray-300 text-sm">
            Discover exclusive auctions. Place your bids. Win amazing deals.
          </p>
        </div>

        <button
          onClick={() => navigate("/active-auctions")}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg"
        >
          View Live Auctions
        </button>

        <div className="text-white flex space-x-5">
          <AiFillFacebook size={"2rem"} className="cursor-pointer" />
          <AiFillInstagram size={"2rem"} className="cursor-pointer" />
          <AiFillTwitterSquare size={"2rem"} className="cursor-pointer" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
