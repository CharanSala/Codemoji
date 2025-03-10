import React from 'react';
import sample_audio from '/audio.mp3';
// Coordinator images – ensure these exist in your public/images folder
import coordinator1 from '';
import coordinator2 from '';
import coordinator3 from '';

import Navbar from '../components/Navbar'; // Ensure correct import path

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Competition Rounds Section */}
      <div className="px-6 md:px-12 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Competition Rounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Round 1: Logic Patch */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">Round 1: Logic Patch</h3>
            <p className="text-gray-600 mb-4">
              In this round, participants are tasked with analyzing and fixing a logic patch.
              It requires keen attention to detail and the ability to spot inefficiencies.
            </p>
            <p className="text-gray-800 font-semibold">Instructions:</p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Review the provided patch thoroughly.</li>
              <li>Identify and correct any logical errors.</li>
              <li>Optimize the solution where possible.</li>
            </ul>
          </div>
          {/* Round 2: Emoji Description */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">Round 2: Emoji Description</h3>
            <p className="text-gray-600 mb-4">
              Here, you need to interpret a set of emojis and provide a creative description that fits the given theme.
            </p>
            <p className="text-gray-800 font-semibold">Instructions:</p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Analyze the emojis carefully.</li>
              <li>Craft a descriptive narrative based on the emojis.</li>
              <li>Keep the description fun yet relevant.</li>
            </ul>
          </div>
          {/* Round 3: Code Unreveal */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">Round 3: Code Unreveal</h3>
            <p className="text-gray-600 mb-4">
              In this round, the code is hidden. Participants must follow clues to reveal the code,
              testing both their problem-solving skills and perseverance.
            </p>
            <p className="text-gray-800 font-semibold">Instructions:</p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Follow the provided clues step by step.</li>
              <li>Solve puzzles to gradually unveil the hidden code.</li>
              <li>Submit the final revealed code within the time limit.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Coordinators Section */}
      <div className="px-6 md:px-12 py-12 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Our Coordinators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coordinator 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img
              src={coordinator1}
              alt="Coordinator 1"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">John Doe</h3>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/johndoe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/johndoe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800"
              >
                Instagram
              </a>
              <a
                href="https://github.com/johndoe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
          </div>
          {/* Coordinator 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img
              src={coordinator2}
              alt="Coordinator 2"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/janesmith"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/janesmith"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800"
              >
                Instagram
              </a>
              <a
                href="https://github.com/janesmith"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
          </div>
          {/* Coordinator 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img
              src={coordinator3}
              alt="Coordinator 3"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Alex Johnson</h3>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/alexjohnson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/alexjohnson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800"
              >
                Instagram
              </a>
              <a
                href="https://github.com/alexjohnson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Section */}
      <div className="flex justify-center my-8">
        <audio
          controls
          autoPlay
          loop
          className="bg-white rounded-lg shadow-md p-2"
        >
          <source src={sample_audio} type="audio/mp3" />
        </audio>
      </div>
    </div>
  );
};

export default About;
