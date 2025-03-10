import React from 'react';
import unique_img from '/images/image.jpg';
import sample_audio from '/audio.mp3';

import Navbar from '../components/Navbar'; // Ensure correct import path

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen relative">
      
      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="flex justify-center items-center px-6 md:px-12 py-16">
        <div className="max-w-5xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12 bg-white shadow-xl rounded-lg p-8">
          
          {/* Image Section */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              className="w-full h-full object-cover rounded-2xl shadow-lg"
              src={unique_img}
              alt="Unique Image"
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center items-start space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">What is CoretoGlo?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              "CoretoGlo" is a name you've chosen, but it doesn’t appear to be a standard or widely recognized term with a defined meaning. It looks like a combination of two words:
            </p>
            <p className="text-lg text-gray-600 font-semibold">
              <strong>Coreto</strong>: This could be derived from the word "Core" (which can represent the central or most important part of something) or it could be a unique or brand-specific word you're creating.
            </p>
            <p className="text-lg text-gray-600 font-semibold">
              <strong>Glo</strong>: This could be shorthand for "Glow," meaning light, brilliance, or something that shines. "Glo" can also symbolize something vibrant, energetic, or growing.
            </p>
          </div>

        </div>
      </div>

      {/* Video Section */}
      {/* <div className="flex justify-center my-12">
        <video
          controls
          autoPlay
          className="w-full max-w-2xl h-auto rounded-2xl shadow-lg"
        >
          <source src={video} />
        </video>
      </div> */}

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
