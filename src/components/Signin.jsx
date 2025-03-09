import React, { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "./Navbar";

export const UserContext = createContext();

const Signin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = data;
  const [user, setUser] = useState(null);

  const handler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const display = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://codemojibackend.onrender.com/participantverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server Response:", result);
      setMessage(result.message);

      if (response.ok) {
        // Store only participantEmail in sessionStorage
        sessionStorage.setItem("participantEmail", result.email);

        // Navigate to Events page (we will fetch full data there)
        navigate("/signin/events");
      }

    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onSubmit(); // Simulating API call
    setLoading(false);
  };
  
  return (
    <UserContext.Provider value={user}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-6">
          {/* Glassmorphism with Light Borders */}
          <div className="relative bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-300 transition-all duration-300 hover:shadow-2xl">

            <h2 className="text-[#01052A] text-2xl font-bold text-center mb-6">
              Welcome to CodeMoji!
            </h2>

            {message && <div className="text-red-600 text-center mb-4">{message}</div>}

            <form onSubmit={display} className="space-y-5">
              {/* Email Input */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={handler}
                  placeholder="Enter your email"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01052A] transition-all duration-300 hover:border-[#01052A]"
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col relative">
                <label htmlFor="password" className="text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handler}
                  placeholder="Enter your password"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01052A] transition-all duration-300 hover:border-[#01052A]"
                />
                <button
                  type="button"
                  className="absolute right-4 top-12 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Soft-Shadow Button */}
              <button
                type="submit"
                className={`w-full py-3 bg-[#01052A] text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={handleClick}
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </button>

              {/* Footer Message */}
              <div className="text-center mt-4 text-gray-600 font-medium">
                <p className="text-sm font-bold">🌟 Where coding meets creativity 🌟</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Signin;
