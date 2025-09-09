import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/active-auctions");
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md text-center animate-fade-in">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={60} />
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Payment Completed!
        </h2>
        <p className="text-gray-600 text-lg">
          Thank you for your payment. You’ll be redirected shortly...
        </p>
        <div className="mt-6 text-sm text-gray-400 animate-pulse">
          Redirecting to active auctions...
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
