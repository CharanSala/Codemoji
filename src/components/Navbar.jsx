import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className="bg-white shadow-md">
      {/* Navbar Container */}
      <div className="flex items-center justify-between px-6 py-4 relative">
        {/* Unique Title Design */}
        <h2 className="text-3xl font-bold text-gray-800 relative z-10">
          Coreto
          <span className="text-gray-500 font-light">Glo</span>
        </h2>

        {/* Navigation Links */}
        <ul className="flex space-x-8 text-lg font-medium relative z-10">
          <li>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 transition duration-300 relative z-10"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/signin"
              className="text-gray-600 hover:text-gray-800 transition duration-300 relative z-10"
            >
              Sign In
            </Link>
          </li>
        </ul>

        {/* Navbar Decorative Underline */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 transform scale-x-0 origin-left hover:scale-x-100 transition-all duration-500"></div>
      </div>
    </div>
  )
}

export default Navbar