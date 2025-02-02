import React, { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";

const CountDown = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const { userName } = useUser();

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count);
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
      clearInterval(timer);
      onComplete();
    }

    return () => clearInterval(timer); // Cleanup timer
  }, [count, onComplete]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-semibold">Get ready {userName}!</h1>
      {count > 0 ? (
        <>
          <h1 className="text-4xl my-4">The quiz will start in {count}</h1>
          <img
            src={`/assets/countdown-images/zoro-loading-${count}.png`}
            alt={`Countdown ${count}`}
            className="w-20 h-20 transition-transform duration-500 scale-110"
          />
        </>
      ) : (
        <p className="text-6xl font-bold">GO!</p>
      )}
    </div>
  );
};

export default CountDown;
