import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useUser } from "./context/UserContext";

const CountDown = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const { userName } = useUser();
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
        { x: "-150%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
      )
        .to(imageRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.5,
        });
    }
  }, [count]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-semibold">Get ready {userName}!</h1>
      
      {count > 0 ? (
        <>
          <h1 className="text-4xl my-4">The quiz will start in {count}</h1>
          <div className="relative p-4 w-32 h-32 overflow-hidden rounded-full">
            <img
              key={count} // Ensures a re-render on count change
              src={`/assets/countdown-images/zoro-loading-${count}.png`}
              alt={`Countdown ${count}`}
              ref={imageRef}
              className="absolute w-24 h-24"
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
