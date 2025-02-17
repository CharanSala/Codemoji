import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
              className="text-gray-200 hover:text-blue-500 transition duration-300 flex items-center"
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link
              to="/signin"
              className="text-gray-200 hover:text-blue-500 transition duration-300 flex items-center"
            >
              🔑 Sign In
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-200 hover:text-blue-500 transition duration-300 flex items-center"
            >
              ℹ️ About
            </Link>
          </li>
        </ul>

        {/* Navbar Decorative Underline */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-600 transform scale-x-0 origin-left hover:scale-x-100 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default Navbar;
