import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useUser } from "./context/UserContext";

const CountDown = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const { userName, selectedCharacter } = useUser();
  const imageRef = useRef(null);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  useEffect(() => {
    if (imageRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        imageRef.current,
        { 
          scale: 0.1, 
          opacity: 0,
          filter: "brightness(0) blur(5px)"
        },
        { 
          scale: 1.1, 
          opacity: 1,
          filter: "brightness(1.2) blur(0px)",
          duration: 0.4, 
          ease: "power2.out" 
        }
      ).to(imageRef.current, {
        scale: 1,
        filter: "brightness(1)",
        duration: 0.3,
        ease: "elastic.out(1, 0.3)",
        delay: 0.1
      }).to(imageRef.current, {
        opacity: 0,
        scale: 1.5,
        duration: 0.5,
        delay: 0.7,
        ease: "power2.in"
      });
    }
  }, [count]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-semibold">Attention {userName}!</h1>

      {count > 0 ? (
        <>
          <h1 className="text-4xl my-4">The quiz will start in {count}</h1>

          {/* Character Image Container */}
          <div
            className={`relative p-4 overflow-hidden ${
              selectedCharacter.imgName === "luffy" ? "w-36" : "w-28"
            }`}
          >
            <img
              key={count}
              src={`/assets/countdown-images/${selectedCharacter.imgName}-loading-${count}.png`}
              alt={`Countdown ${count}`}
              ref={imageRef}
              className={`${
                selectedCharacter.imgName === "luffy" ? "w-36" : "w-28"
              } transition-all duration-700`}
            />
          </div>
        </>
      ) : (
        <p className="text-6xl font-bold">GO!</p>
      )}
    </div>
  );
};

export default CountDown;
