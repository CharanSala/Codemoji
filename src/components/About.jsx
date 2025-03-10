import React from 'react';
import Navbar from './Navbar'; // Adjust the import as needed
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

// Import your photos
import photo1 from '/images/image.jpg';
import photo2 from '/images/image.jpg';
import photo3 from '/images/image.jpg';


const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen relative">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          About Us
        </h2>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="w-full">
            <img
              src={photo1}
              alt="Team Member 1"
              className="rounded-lg shadow-lg object-cover w-full h-full"
            />
          </div>
          <div className="w-full">
            <img
              src={photo2}
              alt="Team Member 2"
              className="rounded-lg shadow-lg object-cover w-full h-full"
            />
          </div>
          <div className="w-full">
            <img
              src={photo3}
              alt="Team Member 3"
              className="rounded-lg shadow-lg object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center mt-12 space-x-6">
          <a
            href="https://www.linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={32} className="text-blue-700 hover:text-blue-800" />
          </a>
          <a
            href="https://www.instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram size={32} className="text-pink-600 hover:text-pink-700" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
