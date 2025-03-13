import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Signin";
import Events from "./Events";

const Home = () => {
  const username = useContext(UserContext);
  const eventDate = new Date("2025-03-13T14:30:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
 const [isButtonEnabled, setIsButtonEnabled] = useState(false);
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
    navigate("/signin");
  };


  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Enable button if time is 6:08 AM or later
      if (currentHours > 14 || (currentHours === 14 && currentMinutes >= 30)) {
        setIsButtonEnabled(true);
      }
    };
  
    checkTime(); // Initial check
    const interval = setInterval(checkTime, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div className="-z-10 absolute bg-[#01052A] h-[55%] w-full"></div>
      <Navbar />
      <div 
  className="min-h-screen flex flex-col items-center bg-no-repeat bg-top text-white"
  style={{ backgroundImage: "", backgroundSize: "100% 50vh" }}
>

    
        <div className="text-center pt-16 px-6">
          <h1 className="text-6xl font-bold drop-shadow-lg text-white">
            Code<span className="text-blue-400">Moji</span>😝
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
           CodeMoji is where coding meets creativity and fun through emojis!
          </p>
           <button
      className={`mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 ${
        !isButtonEnabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleStartClick}
      disabled={!isButtonEnabled}
    >
      Let's Start
    </button>
        </div>

        {/* Wrapping the boxes in a container to control their positioning better */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-8 max-w-6xl mx-auto z-10 relative">
          {[
            {
              title: "Logic Patch",
              description: "Participants analyze an incomplete emoji code, identify missing logic, and complete it correctly.",
              
              icon: "🧩",
            },
            {
              title: "Emoji Decription",
              description: "Participants translate an emoji program into C, C++, Java, or Python, ensuring all test cases pass.",
              icon: "👨‍💻",
            },
            {
              title: "Code Reveal",
              description: "participants analyze an emoji program step by step to determine its output.",
              icon: "🔍",
            },
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center text-gray-900">
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          ))}
        </div>


        <div className="mt-12 text-center text-xl font-semibold text-gray-900">
          ⏳ The Codemoji Countdown:
          <div className="text-4xl font-extrabold text-yellow-500 mt-4 drop-shadow-lg">
        {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
