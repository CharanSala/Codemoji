import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility
  const [emojies,setEmoji]= useState(0);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
 


  useEffect(() => {
    const fetchPoints = async () => {
        try {
            const email = sessionStorage.getItem("participantEmail"); // Get email from session storage
            if (!email) {
                console.error("No email found in session storage.");
                return;
            }

            const response = await fetch(`https://codemojibackend.onrender.com/getPoints1?email=${encodeURIComponent(email)}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
          });
          
            if (!response.ok) {
                throw new Error("Failed to fetch points");
            }

            const data = await response.json();
            console.log("emojies",data.points);

            setEmoji(data.points);
        } catch (error) {
            console.error("Error fetching points:", error);
        }
    };
    const intervalId = setInterval(fetchPoints, 5000);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
}, []);

  return (
    <div className="bg-[#01052A] shadow-md">
      {/* Navbar Container */}
      <div className="flex items-center justify-between px-6 py-4 relative">
        {/* Unique Title Design with Emojis */}
        <h2 className="text-3xl font-bold text-gray-800 relative z-10 flex items-center">
          <span className="mr-2">🚀</span><span className='text-gray-200'>Code</span>
          <span className="text-blue-500 font-light">Moji</span>
          <span className="ml-2">😜</span>
        </h2>

        {/* Hamburger Menu for Small Screens */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links (Hidden on Small Screens, Visible on Larger Screens) */}
        <ul
          className={`flex space-x-8 text-lg font-medium relative z-10 lg:flex ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <li>
            <Link
              to="/"
              className="text-gray-200 mt-3 hover:text-blue-500 transition duration-300 flex items-center"
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link
              to="/signin"
              className="text-gray-200 mt-3 hover:text-blue-500 transition duration-300 flex items-center"
            >
              🔑 Sign In
            </Link>
          </li>
          <li>
          <Link
              to="/leaderboard"
              className="text-gray-200 mt-3 hover:text-blue-500 transition duration-300 flex items-center"
            >
              🏆Leaderboard
            </Link>
          </li>
          
          <li>
            <Link
              to="/about"
              className="text-gray-200 mt-3 hover:text-blue-500 transition duration-300 flex items-center"
            >
              ℹ️ About
            </Link>
            
          </li>
          <li className="flex items-center gap-2 px-4 py-2  bg-[#01052A] rounded-lg shadow-md border border-gray-600">
    <p className="text-white text-lg font-semibold flex items-center gap-2">
        😜 <span className="text-yellow-400 pl-3">{emojies}</span>
    </p>
</li>

        </ul>

        {/* Navbar Decorative Underline */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-600 transform scale-x-0 origin-left hover:scale-x-100 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default Navbar;
