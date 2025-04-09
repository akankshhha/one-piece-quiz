import React, {useEffect, useState} from 'react'

const ScrambleText = ({text, scrambleSpeed}) => {
    const [displayText, setDisplayText] = useState('')
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    const finalText = text || "";

    useEffect(() => {
        let currentIndex = 0;
        let iteration = 0;

        const interval = setInterval(() => {
            if (currentIndex >= finalText.length) {
                clearInterval(interval);
                setDisplayText(finalText);
                return;
              }

              setDisplayText(prev => {
                const result = finalText
                  .split("")
                  .map((char, index) => {
                    if (index < currentIndex) {
                      return finalText[index];
                    }
                    
                    return chars[Math.floor(Math.random() * chars.length)];
                  })
                  .join("");
                  
                return result;
              });

              if (iteration >= 3) {
                currentIndex++;
                iteration = 0;
              }
              iteration++;

        }, scrambleSpeed);
    }, [finalText, scrambleSpeed])

  return (
    <span className='text-yellow-400'>
      {displayText}
    </span>
  )
}

export default ScrambleText
