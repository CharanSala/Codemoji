import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/Signin";
import Events from "../components/Events";

const Home = () => {
  const username = useContext(UserContext); // Get the username from context
  const eventDate = new Date("2025-03-13T00:00:00"); // Target date for countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const navigate = useNavigate();  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleStartClick = () => {
    navigate("/Events");  // Navigate to the new page
  };

  return (
    <div className="bg-light-blue-50 h-screen overflow-hidden text-gray-800">
      <Navbar />
      <div className="p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 drop-shadow-md">
          Welcome{username ? `, ${username}` : ""}! 🎉
        </h2>
        
        <p className="mt-6 text-xl text-gray-700">
          🚀 <span className="text-blue-500 font-semibold">CodeMoji</span> is an exciting tech event that blends coding and emojis! 😃💻
        </p>

        <div className="mt-6 text-left max-w-4xl mx-auto text-gray-800">
          <p className="font-semibold text-2xl mt-6">🔹 Round 1: Emoji to Code</p>
          <p>Participants receive an emoji-based program 🤔. They must interpret the emojis and convert them into a valid programming language (C, C++, Java, Python) ensuring all test cases pass. ✅</p>
          
          <p className="font-semibold text-2xl mt-6">🔹 Round 2: Logic Patch</p>
          <p>Participants receive a partially completed emoji code with missing logic (❓). They must identify the missing parts and complete the code correctly. 🛠️</p>
          
          <p className="font-semibold text-2xl mt-6">🔹 Round 3: Track and Output</p>
          <p>Participants receive a correctly written emoji code 👀. Their task is to analyze the execution step by step and write the exact output without any errors. 📝</p>
        </div>

        <div className="mt-8 text-xl font-semibold text-gray-900">
          ⏳ Countdown to the Big Day:
          <div className="text-4xl font-extrabold text-blue-600 mt-4 drop-shadow-lg">
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </div>
        </div>
        
        <button className="mt-8 px-8 py-3 text-white bg-blue-500 text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
         onClick={handleStartClick} >
          🚀 Let's Start!
        </button>
      </div>
    </div>
  );
};

export default Home;
