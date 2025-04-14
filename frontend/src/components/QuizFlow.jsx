import React, { useState, useEffect } from "react";
import StartScreen from "./StartScreen";
import CountDown from "./CountDown";
import Questions from "./Questions";
import Scoreboard from "./Scoreboard";
import { UserProvider } from "./context/UserContext";
import Disclaimer from "./Disclaimer";
import Loader from "./Loader";
import Ripples from 'react-ripples'
import "../App.css";

const QuizFlow = () => {
  const [showCountdown, setShowCountdown] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Start Quiz
  const startQuiz = () => {
    setShowDisclaimer(true);
    // setShowCountdown(true);
  };

  // Countdown Complete
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setQuizStarted(true);
  };

  // Go Back (Uniform Approach)
  const onGoBack = () => {
    setShowCountdown(false);
    setQuizStarted(false);
    setShowScoreboard(false);
  };

  const handleShowCountdown = () => {
    setShowCountdown(true);
    setShowDisclaimer(false);
  };

  // Show Scoreboard
  const handleShowScoreboard = () => {
    setShowScoreboard(!showScoreboard);
  };

  return (
    <UserProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Start Screen */}
          {!showCountdown &&
            !quizStarted &&
            !showScoreboard &&
            !showDisclaimer && <StartScreen onStart={startQuiz} />}

          {/* Countdown */}
          {showCountdown && !quizStarted && !showScoreboard && (
            <CountDown onComplete={handleCountdownComplete} />
          )}

          {/* Quiz Questions */}
          {quizStarted && !showScoreboard && <Questions onGoBack={onGoBack} />}

          {/* Disclaimer */}
          {showDisclaimer && (
            <Disclaimer handleCountdown={handleShowCountdown} />
          )}

          {/* Scoreboard */}
          {showScoreboard && <Scoreboard />}

          {/* View Scoreboard Button on Start Screen */}
          {!showCountdown && !quizStarted && (
            <div className="fixed bottom-4 right-4">
              <Ripples>
                <button
                  onClick={handleShowScoreboard}
                  className="px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 text-xl bg-slate-700"
                >
                  {showScoreboard ? "Go back" : "View Showboard"}
                </button>
              </Ripples>
             
            </div>
          )}
        </>
      )}
    </UserProvider>
  );
};

export default QuizFlow;
