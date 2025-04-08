import React, {useRef} from 'react'
import Typewriter from "typewriter-effect";
import { useUser } from './context/UserContext';
import '../utilities/styles/animations.css'

const Disclaimer = ({handleCountdown}) => {
    const instructionRef = useRef(null)
    const { username } = useUser();
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 w-7/12 m-auto">
    <h1 className="blink text-red-600 font-semibold text-5xl">Instructions</h1>
    <p className="font-vt323 text-cream-yellow text-2xl w-full text-left whitespace-pre-wrap" ref={instructionRef}>
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString(
              ` Hey ${username}. You will be given 10 questions, if you do not know the answer you may skip the question - the points will be zero for the question skipped. The score is out of 10. Good luck pirate! You'll need it.`
            )
            .pauseFor(100)
            .changeCursor(" ")
            .start();
        }}
        options={{
          cursor: "_",
          delay: 30,
        }}
      />
    </p>
    <button onClick={handleCountdown} className="text-xl bg-slate-700 py-2 px-4 rounded-lg">ok. Let's go!</button>
  </div>
  
  )
}

export default Disclaimer
