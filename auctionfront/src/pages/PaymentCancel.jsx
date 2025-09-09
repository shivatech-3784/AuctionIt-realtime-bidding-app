import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <p className="text-red-600 text-2xl font-semibold mb-6">
         Payment was cancelled. Please try again.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
      >
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default PaymentCancel;
