import React, { useState, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import CountDown from "./components/CountDown";
import Questions from "./components/Questions";
import Scoreboard from "./components/Scoreboard";
import { UserProvider } from "./components/context/UserContext";
import Loader from "./components/reusable/Loader";
import '../src/App.css'

const App = () => {
  const [showCountdown, setShowCountdown] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Start Quiz
  const startQuiz = () => {
    setShowCountdown(true); 
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
          {!showCountdown && !quizStarted && !showScoreboard && (
            <StartScreen onStart={startQuiz} />
          )}

          {/* Countdown */}
          {showCountdown && !quizStarted && !showScoreboard && (
            <CountDown onComplete={handleCountdownComplete} />
          )}

          {/* Quiz Questions */}
          {quizStarted && !showScoreboard && <Questions onGoBack={onGoBack} />}

          {/* Scoreboard */}
          {showScoreboard && <Scoreboard />}

          {/* View Scoreboard Button on Start Screen */}
          {!showCountdown && !quizStarted && (
            <div className="fixed bottom-4 right-4">
              <button
                onClick={handleShowScoreboard}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {showScoreboard ? 'Go back' : 'View Showboard'}
              </button>
            </div>
          )}
        </>
      )}
    </UserProvider>
  );
};

export default App;
