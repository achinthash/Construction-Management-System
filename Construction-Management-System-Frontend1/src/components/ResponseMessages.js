import React, { useState } from "react";

export default function ResponseMessages({ setErrorMessage, setSuccessMessage }) {


  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to display error message with auto-clear
  const showError = (message, timeout = 3000) => {
    setError(message);
    setTimeout(() => setError(""), timeout);
  };

  // Function to display success message with auto-clear
  const showSuccess = (message, timeout = 3000) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), timeout);
  };

  
  setErrorMessage.current = showError;
  setSuccessMessage.current = showSuccess;

  return (
    <div>
      {error && (
        <div className="bottom-2 right-4 absolute">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <p className="w-full">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="bottom-2 right-4 absolute">
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-md">
            <p className="w-full">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
}
