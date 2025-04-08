import React, { useState, useRef, useEffect } from "react";
import { useUser } from "./context/UserContext";
import Typewriter from "typewriter-effect";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

const StartScreen = ({ onStart }) => {
  const { username, setUsername, selectedCharacter, setSelectedCharacter } = useUser();
  const [inputValue, setInputValue] = useState("");
  const pirateRef = useRef(null);
  const pirateNameRef = useRef(null)
  const nameRef = useRef(null);
  const inputRef = useRef(null);
  const [showNameTypewriter, setShowNameTypewriter] = useState(false);
  const [showCharacterList, setShowCharacterList] = useState(false);
  // const characterRefs = useRef([]);
  const nameSectionRef = useRef(null);
  const characterSectionRef = useRef();

  const characters = [
    {
      id: 1,
      imgName: "luffy",
      fullName: "Monkey D. Luffy",
      image: "/assets/luffy-chibi.png",
    },
    {
      id: 2,
      imgName: "zoro",
      fullName: "Roronoa Zoro",
      image: "/assets/zoro-chibi.png",
    },
    {
      id: 3,
      imgName: "luffy",
      fullName: "Monkey D. Luffy",
      image: "/assets/luffy-chibi.png",
    },
    {
      id: 4,
      imgName: "zoro",
      fullName: "Roronoa Zoro",
      image: "/assets/zoro-chibi.png",
    },
    {
      id: 5,
      imgName: "luffy",
      fullName: "Monkey D. Luffy",
      image: "/assets/luffy-chibi.png",
    },
    {
      id: 6,
      imgName: "zoro",
      fullName: "Roronoa Zoro",
      image: "/assets/zoro-chibi.png",
    },
    {
      id: 7,
      imgName: "luffy",
      fullName: "Monkey D. Luffy",
      image: "/assets/luffy-chibi.png",
    },
    {
      id: 8,
      imgName: "zoro",
      fullName: "Roronoa Zoro",
      image: "/assets/zoro-chibi.png",
    },
    {
      id: 9,
      imgName: "luffy",
      fullName: "Monkey D. Luffy",
      image: "/assets/luffy-chibi.png",
    },
    {
      id: 10,
      imgName: "zoro",
      fullName: "Roronoa Zoro",
      image: "/assets/zoro-chibi.png",
    }
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

    setUsername(inputValue.trim())
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

    gsap.to(pirateNameRef.current, {
      text: username, // Update to entered name
      duration: 1.2,
      ease: "power2.inOut",
      scrambleText: {
        chars: "abcdefghijklmnopqrstuvwxyz0123456789",
        revealDelay: 0.2,
      }
  });
}

  useEffect(() => {
    if (showCharacterList) {
      gsap.fromTo(
        characterSectionRef.current,
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
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

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl md:text-6xl mb-8 text-center" ref={pirateRef}>
        <Typewriter
          onInit={(typewriter) => {
            typewriter
            .typeString(`Welcome, ${username || "Pirate"}!`) 
              .pauseFor(100)
              .changeCursor(" ")
              .start();
          }}
          options={{
            cursor: "_",
            delay: 40,
          }}
        />
      </h1>

      {showNameTypewriter && (
        <div
          className="flex flex-col items-center gap-6"
          ref={nameSectionRef}
        >
          <div className="text-2xl" ref={nameRef}>
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
          </div>

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
        <div
          ref={characterSectionRef}
          className="text-center opacity-0 scale-80"
        >
          <h2 className="text-xl mb-4 text-center">Choose your partner</h2>
          <div className="grid grid-cols-5 rounded-lg">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`relative cursor-pointer transition-transform duration-300 w-20 h-20 border border-gray-600 flex items-center justify-center`}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={character.fullName}
                data-tooltip-place="bottom"
              >
                <img
                  src={character.image}
                  alt={character.fullName}
                  className={`w-20 h-20  ${
                  selectedCharacter?.id === character.id
                    ? "scale-[1.2]"
                    : "hover:scale-105 "
                }`}
                />
              </div>
            ))}
          </div>

          <Tooltip id="my-tooltip" />
          {/* Start Game Button */}
          {selectedCharacter && (
            <button
              onClick={handleStart}
              className="mt-6 px-6 py-3 text-lg rounded-lg transition-all duration-300 text-white hover:bg-gray-700"
            >
              Confirm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StartScreen;
