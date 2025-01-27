import React, { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";

const CountDown = ({  onComplete }) => {
  const [count, setCount] = useState(3); 
  const {userName} = useUser()

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1); 
    }, 1000);

    if (count === 0) {
      clearInterval(timer);
      onComplete(); 
    }

    return () => clearInterval(timer); // Cleanup timer
  }, [count, onComplete]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-red-500 text-white">
      <h1>Get ready {userName}!</h1>
      <h1 className="text-4xl font-bold mb-4">
        The quiz will start in
      </h1>
      <p className="text-6xl font-extrabold">{count > 0 ? count : "GO!"}</p>
    </div>
  );
};

export default CountDown;
