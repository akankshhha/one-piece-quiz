import React, { useState, useEffect, useRef } from 'react';
import { useUser } from './context/UserContext';
import { gsap } from "gsap";

const StartScreen = ({ onStart }) => {
  const { setUsername } = useUser();
  const [inputValue, setInputValue] = useState('')
  const titleRef = useRef(null);

  const handleNameInput = (event) => {
    setInputValue(event.target.value);
    setUsername(event.target.value)
  };

  useEffect(() => {
    // GSAP Animation: Fade-in and scale
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-bold text-blue-700 mb-8 text-center drop-shadow-md" ref={titleRef}>
        Welcome, Pirate!
      </h1>

      {/* Name Input */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <p className="text-lg text-gray-700 font-semibold">What is the name you go by?</p>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleNameInput}
            placeholder="Enter your name"
            className="px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:outline-none bg-white text-black w-64 transition-all duration-300 ease-in-out shadow-sm"
          />
          <button
            onClick={onStart}
            className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Game start!
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
