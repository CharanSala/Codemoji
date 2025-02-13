import React, { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "./Navbar";

export const UserContext = createContext();

const Signin = () => {
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  
  const [message, setMessage] = useState(""); // State to store message
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  
  const { email, password } = data;
  const [user, setUser] = useState(null);

  const handler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const display = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/participantverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result.participant)

      if (response.ok) {
        
        navigate("events", { state: { participant: result.participant } });
      } else {
        console.error("Verification failed:", result.message);
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <UserContext.Provider value={user}> {/* Provide user context */}
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={display}>
              <div className="space-y-6">
                <h2 className="text-gray-800 text-3xl font-semibold mb-6 text-center">
                  Welcome!
                </h2>

                {message && (
                  <div className="text-red-600 text-center mb-4">
                    {message}
                  </div>
                )}

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={handler}
                    placeholder="Enter your email"
                    className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label htmlFor="password" className="text-gray-700 font-semibold mb-2">
                    Password
                  </label>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handler}
                    placeholder="Enter your password"
                    className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 mt-2 mr-2 top-10 text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>

                <div className="flex justify-center mt-4">
                  <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
                    Forgot your password?
                  </a>
                </div>

                <div className="flex justify-center mt-2">
                  <p className="text-gray-600 text-sm">
                    Don't have an account? 
                    <a href="/signup" className="text-blue-600 hover:underline">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Signin;
