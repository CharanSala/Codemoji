import React from 'react';
import Navbar from './Navbar'; // Adjust the import as needed
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

// Import your photos
import photo1 from '/images/image.jpg';
import photo2 from '/images/image.jpg';
import photo3 from '/images/image.jpg';

// Team members data
const teamMembers = [
  {
    name: 'Team Member 1',
    image: photo1,
    github: 'https://github.com/username1',
    linkedin: 'https://www.linkedin.com/in/username1',
    instagram: 'https://www.instagram.com/username1',
  },
  {
    name: 'Team Member 2',
    image: photo2,
    github: 'https://github.com/username2',
    linkedin: 'https://www.linkedin.com/in/username2',
    instagram: 'https://www.instagram.com/username2',
  },
  {
    name: 'Team Member 3',
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
        <div className="flex items-center justify-center flex-wrap gap-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center max-w-xs"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-md object-cover mb-4"
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
  );
};

export default About;