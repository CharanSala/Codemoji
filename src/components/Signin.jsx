import React, { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export const UserContext = createContext();

const Signin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = data;

  const handler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const display = (e) => {
    e.preventDefault();
    console.log(data);
    navigate("/"); // Redirect to /home after submitting
  };

  return (
    <UserContext.Provider value={username}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Signin Form Container */}
        <div className="flex-grow flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={display}>
              <div className="space-y-4">
                <h2 className="text-gray-700 text-2xl mb-10">
                  Get started on CoretoGlo
                </h2>
                <div className="flex flex-col">
                  <label
                    htmlFor="username"
                    className="text-gray-700 font-semibold mb-2"
                  >
                    Username
                  </label>
                  <input
                    required
                    type="text"
                    name="username"
                    value={username}
                    onChange={handler}
                    placeholder="Username"
                    className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-gray-700 font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={handler}
                    placeholder="Email"
                    className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-gray-700 font-semibold mb-2"
                  >
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={password}
                    onChange={handler}
                    placeholder="Password"
                    className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Signin;
