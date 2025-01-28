import React, { useState, useRef, useEffect } from "react";
import { useUser } from "./context/UserContext";
import Typewriter from "typewriter-effect";
import gsap from "gsap";

const StartScreen = ({ onStart }) => {
  const { setUsername } = useUser();
  const [inputValue, setInputValue] = useState("");
  const pirateRef = useRef(null);
  const nameRef = useRef(null);
  const inputRef = useRef(null);
  const [showNameTypewriter, setShowNameTypewriter] = useState(false);

  const handleNameInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleStart = () => {
    if (!inputValue.trim()) {
      alert("Please enter a name to proceed!");
      return;
    }
    if (inputValue.length < 3) {
      alert("Please enter a name that has more than 2 characters!");
      return;
    }
    setUsername(inputValue.trim());
    onStart();
  };

  useEffect(() => {
    const timeline = gsap.timeline();
    timeline
      .to(pirateRef.current, {
        opacity: 1,
        delay: 2,
        // y: "-40%",
        scale: 0.8,
        duration: 1,
        ease: "power3.inOut",
      })
      .fromTo(
        nameRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          onComplete: () => {
            setShowNameTypewriter(true);
          },
        }
      );

    return () => timeline.kill();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <h1
        className="text-5xl md:text-6xl font-semibold mb-8 text-center"
        ref={pirateRef}
      >
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Welcome, Pirate!")
              .pauseFor(100)
              .changeCursor(" ")
              .start();
          }}
          options={{
            cursor: "_",
          }}
        />
      </h1>

      {showNameTypewriter && (
        <div className="flex flex-col items-center gap-6 mb-10">
          <p className="text-2xl" ref={nameRef}>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("What is the name you go by?")
                  .callFunction(() => {
                    gsap.fromTo(
                      inputRef.current,
                      {
                        opacity: 0,
                        y: 20,
                        scale: 0.8,
                      },
                      {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.5)",
                      }
                    );
                  })
                  .start();
              }}
            />
          </p>

          <div ref={inputRef} className="flex items-center gap-4 opacity-0">
            <input
              type="text"
              value={inputValue}
              onChange={handleNameInput}
              placeholder="Enter your name"
              className="px-4 py-3 text-lg border border-gray-500 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none text-white w-64 transition-all duration-300 ease-in-out shadow-sm bg-gray-700"
            />
            <button
              onClick={handleStart}
              className="px-6 py-3 text-white text-lg rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartScreen;
