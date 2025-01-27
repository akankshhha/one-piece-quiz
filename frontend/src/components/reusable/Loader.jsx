


import { useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = () => {
  const boxesRef = useRef([]);

  useEffect(() => {
    const timeline = gsap.timeline({
      repeat: -1, // Loop the animation
      repeatDelay: 0.5, // Delay before repeating,
    });

    boxesRef.current.forEach((box) => {
      timeline.to(
        box,
        {
          backgroundColor: "#84cc16", // Lime green for the retro style
          duration: 0.5,
          ease: "power1.inOut",
        },
      );
    });

    
    return () => timeline.kill(); // Cleanup animation
  }, []);

  return (
    <div id="loader" className="flex flex-col justify-center items-center h-screen bg-[#1E201E]">
      <div className="text-loader font-vt323 text-white text-3xl mb-4 font-vt323">Loading</div>
      <div className="progress-bar-container flex space-x-1 bg-gray-700 rounded-md p-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (boxesRef.current[i] = el)}
            className="box bg-gray-800 w-5 h-5"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;

