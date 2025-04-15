import React, {useRef, useState} from 'react'
import Typewriter from "typewriter-effect";
import { useUser } from './context/UserContext';
import Ripples from "react-ripples";
import '../utilities/styles/animations.css'

const Disclaimer = ({handleCountdown}) => {
    const instructionRef = useRef(null)
    const [showButton, setShowButton] = useState(false)
    const [skip, setSkip] = useState(false)
    const { userName } = useUser();
    
const skipDisclaimer = () => {
  setSkip(true)
  setShowButton(true)
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 w-7/12 m-auto">
    <h1 className="blink text-red-600 font-semibold text-5xl">Instructions</h1>
    <h4 onClick={skipDisclaimer} className={`cursor-pointer text-2xl text-blue-400 ${skip ? 'opacity-40 cursor-default' : 'opacity-100'}`}>Skip{'>>'}</h4>
    <div className="font-vt323 text-cream-yellow text-2xl w-full text-left whitespace-pre-wrap" ref={instructionRef}>
      {!skip ? <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString(
              `Hey <span style="color: #facc15;">${userName}</span>. You will be given 10 questions, if you do not know the answer you may skip the question - the points will be zero for the question skipped. The score is out of 10. Good luck pirate! You'll need it.`
            )
            .pauseFor(100)
            .callFunction(() => skipDisclaimer())
            .changeCursor(" ")
            .start();
        }}
        options={{
          cursor: "_",
          delay: 20,
          html: true
        }}
      /> : <p>{`Hey`} <span className='text-yellow-400'>{`${userName}.`}</span> {`You will be given 10 questions, if you do not know the answer you may skip the question - the points will be zero for the question skipped. The score is out of 10. Good luck pirate! You'll need it.`}</p>}
    </div>
    <Ripples>
      <button onClick={handleCountdown} className={`text-xl bg-slate-700 py-2 px-4 rounded-lg transition-opacity delay-700 duration-200 ${showButton ? 'opacity-100' : 'opacity-0'}`} >Ok. Let's go!</button>
    </Ripples>
  </div>
  )
}

export default Disclaimer
