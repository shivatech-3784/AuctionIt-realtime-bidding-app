
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-yellow-500 text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} AuctionIt | All rights reserved.</p>
    </footer>
  );
};

export default Footer;
