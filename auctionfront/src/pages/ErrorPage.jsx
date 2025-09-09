import React from "react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
        <p className="text-lg mt-4">Oops! The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
