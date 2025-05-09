import React from 'react';
import Navbar from './Navbar'; // Adjust the import as needed
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

// Import your photos
import photo1 from '/images/photo1.jpg';
import photo2 from '/images/photo3.jpg';
import photo3 from '/images/photo2.jpg';

// Team members data
const teamMembers = [
  {
    name: 'Charan Sala',
    image: photo1,
    github: 'https://github.com/username1',
    linkedin: 'https://www.linkedin.com/in/username1',
    instagram: 'https://www.instagram.com/username1',
  },
  {
    name: 'D Pravalika',
    image: photo2,
    github: 'https://github.com/username2',
    linkedin: 'https://www.linkedin.com/in/username2',
    instagram: 'https://www.instagram.com/username2',
  },
  {
    name: 'Sk Kudhan',
    image: photo3,
    github: 'https://github.com/username3',
    linkedin: 'https://www.linkedin.com/in/username3',
    instagram: 'https://www.instagram.com/username3',
  },
];

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

        {/* Team Members Container with small gap */}
        <div className="bg-slate-200 pb-12 w-2/4 mx-auto rounded-2xl shadow shadow-slate-800 ">
        <h2 className="text-2xl font-bold text-center text-gray-800  mb-5 pt-5">
          Cordinators 
        </h2>
        <div className="flex items-center justify-center flex-wrap gap-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex flex-col items-center max-w-xs shadow shadow-slate-800"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-md object-cover mb-4 "
              />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <div className="flex">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} className="text-gray-800 hover:text-gray-900" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="ml-2"
                >
                  <FaLinkedin size={20} className="text-blue-700 hover:text-blue-800" />
                </a>
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="ml-2"
                >
                  <FaInstagram size={20} className="text-pink-600 hover:text-pink-700" />
                </a>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default About;