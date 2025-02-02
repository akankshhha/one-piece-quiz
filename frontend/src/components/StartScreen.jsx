import React, { useState, useRef, useEffect } from "react";
import { useUser } from "./context/UserContext";
import Typewriter from "typewriter-effect";
import gsap from "gsap";

const StartScreen = ({ onStart }) => {
  const { setUsername, selectedCharacter, setSelectedCharacter } = useUser();
  const [inputValue, setInputValue] = useState("");
  const pirateRef = useRef(null);
  const nameRef = useRef(null);
  const inputRef = useRef(null);
  const [showNameTypewriter, setShowNameTypewriter] = useState(false);
  const [showCharacterList, setShowCharacterList] = useState(false);
  // const characterRefs = useRef([]);
  const nameSectionRef = useRef(null);
  const characterSectionRef = useRef();

  const characters = [
    { id: 1, imgName: "luffy", fullName: "Monkey D. Luffy", image: "/assets/luffy-chibi.png" },
    { id: 2, imgName: "zoro", fullName: "Roronoa Zoro", image: "/assets/zoro-chibi.png" },
  ];

  const handleNameInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleConfirm = () => {
    if (!inputValue.trim()) {
      alert("Please enter a name to proceed!");
      return;
    }
    if (inputValue.length < 3) {
      alert("Please enter a name that has more than 2 characters!");
      return;
    }


    // Zoom out name section
    gsap.to(nameSectionRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setShowNameTypewriter(false);
        setShowCharacterList(true);
      },
    });
  };

  useEffect(() => {
    if (showCharacterList) {
      gsap.fromTo(
        characterSectionRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
      );
    }
  }, [showCharacterList]);

  const handleStart = () => {
   
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
          ease: "power3.inOut",
          onComplete: () => {
            setShowNameTypewriter(true);
          },
        }
      );

    return () => timeline.kill();
  }, []);

  // const handleMouseEnter = (index) => {
  //   gsap.to(characterRefs.current[index].querySelector(".char-name"), {
  //     opacity: 1,
  //     y: 3,
  //     duration: 0.1,
  //     ease: "power2.out",
  //   });
  // };

  // const handleMouseLeave = (index) => {
  //   gsap.to(characterRefs.current[index].querySelector(".char-name"), {
  //     opacity: 0,
  //     y: 0,
  //     duration: 0.1,
  //     ease: "power2.out",
  //   });
  // };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl md:text-6xl mb-8 text-center" ref={pirateRef}>
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
            delay: 50,
          }}
        />
      </h1>

      {showNameTypewriter && (
        <div className="flex flex-col items-center gap-6 mb-10" ref={nameSectionRef}>
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
              options={{
                cursor: "_",
                delay: 50,
              }}
            />
          </p>

          <div ref={inputRef} className="flex items-center gap-4 opacity-0">
            <input
              type="text"
              value={inputValue}
              onChange={handleNameInput}
              placeholder="Enter your name"
              className="px-4 py-3 text-lg border border-gray-500 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none w-64 transition-all duration-300 ease-in-out shadow-sm bg-gray-700"
            />
            <button
              onClick={handleConfirm}
              className="px-6 py-3 text-lg rounded-lg transition-all duration-300 ease-in-out transform hover:text-gray-400 shadow-md"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Character Selection */}
      {showCharacterList && (
        <div ref={characterSectionRef} className="mt-8 text-center opacity-0 scale-80">
          <h2 className="text-2xl mb-4">Choose Your Partner</h2>
          <div className="flex gap-8 justify-center">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`relative cursor-pointer transition-transform duration-300 ${
                  selectedCharacter?.id === character.id ? "scale-140" : "hover:scale-105"
                }`}
              >
                <img src={character.image} alt={character.fullName} className="w-20 h-20" />
              </div>
            ))}
          </div>

          {/* Start Game Button */}
          {selectedCharacter && (
            <button
              onClick={handleStart}
              className="mt-6 px-6 py-3 text-lg rounded-lg transition-all duration-300 text-white hover:bg-gray-700"
            >
              Start Game!
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default StartScreen;
