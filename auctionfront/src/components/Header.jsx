import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  AiOutlineHome,
} from "react-icons/ai";
import { FaGavel, FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import UserContext from "../context/UserContext.jsx";
import AxiosInstance from "../utils/ApiConfig.js";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/users/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      // console.error("Logout failed:", err);
    }
  };

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const iconButtonClass =
    "bg-white text-blue-800 p-2 rounded hover:bg-gray-200 transition text-xl";

  return (
    <header className="bg-blue-800 px-6 py-4 flex justify-between items-center shadow-md relative">
      <Link to="/" className="text-2xl font-bold text-white">
        AuctionIt
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-4 items-center">
        <Link to="/" className={iconButtonClass} title="Home">
          <AiOutlineHome />
        </Link>
        <Link to="/active-auctions" className={iconButtonClass} title="Auctions">
          <FaGavel />
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin/auctions" className={iconButtonClass} title="Manage">
            <MdAdminPanelSettings />
          </Link>
        )}
        {user ? (
          <>
            <span className="text-white flex items-center gap-1">
              <FaUserCircle className="text-2xl" /> {user.username}
            </span>
            <button onClick={handleLogout} className={iconButtonClass} title="Logout">
              <FiLogOut />
            </button>
          </>
        ) : (
          <>
            <Link to="/SignIn" className={iconButtonClass} title="Sign In">
              <FiLogIn />
            </Link>
            <Link to="/SignUp" className={iconButtonClass} title="Sign Up">
              <FiUserPlus />
            </Link>
          </>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden text-white cursor-pointer z-50" onClick={toggleMenu}>
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-800 flex flex-col items-start space-y-4 px-6 py-4 md:hidden z-40 shadow-lg">
          <Link to="/" className={iconButtonClass} title="Home" onClick={toggleMenu}>
            <AiOutlineHome />
          </Link>
          <Link to="/auctions" className={iconButtonClass} title="Auctions" onClick={toggleMenu}>
            <FaGavel />
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin/auctions"
              className={iconButtonClass}
              title="Manage"
              onClick={toggleMenu}
            >
              <MdAdminPanelSettings />
            </Link>
          )}
          {user ? (
            <>
              <span className="text-white flex items-center gap-2">
                <FaUserCircle className="text-2xl" />
                {user.username}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className={iconButtonClass}
                title="Logout"
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link to="/SignIn" className={iconButtonClass} title="Sign In" onClick={toggleMenu}>
                <FiLogIn />
              </Link>
              <Link to="/SignUp" className={iconButtonClass} title="Sign Up" onClick={toggleMenu}>
                <FiUserPlus />
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
