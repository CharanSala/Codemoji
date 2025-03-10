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
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          About Us
        </h2>
        
        {/* Event Description */}
        <div className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <p className="mb-4 text-lg text-gray-700">
            Codemoji is a one-of-a-kind tech event that challenges participants with a creative twist on programming. Instead of traditional code, participants work with emoji-based programs—decoding their meaning, identifying missing logic, and analyzing execution. The ultimate goal? Transform a crying emoji into a smiling one by successfully solving all three rounds.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Event Rounds:</h3>
          <div className="text-left max-w-3xl mx-auto text-gray-700 space-y-4">
            <div>
              <p className="mb-1">
                <span className="font-bold">1. Logic Patch –</span> Given an incomplete emoji-based code with missing logic represented by question marks (?), participants must analyze the structure, identify the missing logic, and complete the program correctly.
              </p>
              <p>
                <span className="font-bold">Ex:</span> 🤔(🔢%❓== 0 ) 👉🏼 ✍🏼('Even'); <span className="italic">Value:❓- 2</span>
              </p>
            </div>
            <div>
              <p className="mb-1">
                <span className="font-bold">2. Emoji Description –</span> Participants receive a program written entirely in emojis. Their challenge is to interpret the meaning and translate it into a valid programming language (C, C++, Java, or Python). To proceed, they must ensure all test cases pass successfully.
              </p>
              <p>
                <span className="font-bold">Ex:</span> 🤔(🔢% 2 == 0) <span className="italic">Program: If( a % 2 == 0 )</span>
              </p>
            </div>
            <div>
              <p className="mb-1">
                <span className="font-bold">3. CodeUnreal –</span> Participants must carefully analyze its execution step by step and accurately determine the final output. Precision and attention to detail are key.
              </p>
              <p>
                <span className="font-bold">Ex:</span> 📌 Even(🔢): 🤔(🔢 % 2 == 0 ) 👉🏼 ↩ 🔢 ✍🏼 Even(2) <span className="italic">Output : 2</span>
              </p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-indigo-500"
              />
              <h3 className="text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
              <span className="text-sm text-indigo-600 mb-4">Event Coordinators</span>
              <div className="flex space-x-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="transition transform duration-200 hover:scale-110"
                >
                  <FaGithub size={20} className="text-gray-800 hover:text-gray-900" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition transform duration-200 hover:scale-110"
                >
                  <FaLinkedin size={20} className="text-blue-700 hover:text-blue-800" />
                </a>
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition transform duration-200 hover:scale-110"
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
