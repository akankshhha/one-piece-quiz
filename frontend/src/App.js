import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import CountDown from './components/CountDown';
import Questions from './components/Questions';
import Scoreboard from './components/Scoreboard';
import { UserProvider } from './components/context/UserContext';
import { useUser } from "./components/context/UserContext";

const App = () => {
  // const [difficulty, setDifficulty] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const { username } = useUser();


  // Start Quiz
  const startQuiz = () => {
    if(!username) {
      alert("Please enter the name to proceed!")
      return
    } 
    setShowCountdown(true); // Show countdown
  };

  // Countdown Complete
  const handleCountdownComplete = () => {
    setShowCountdown(false); // Hide countdown
    setQuizStarted(true);    // Start quiz
  };

  // Go Back (Uniform Approach)
  const onGoBack = () => {
    setShowCountdown(false);  // Hide countdown
    setQuizStarted(false);    // Reset quiz
    setShowScoreboard(false); // Hide scoreboard
  };

  // Show Scoreboard
  const handleShowScoreboard = () => {
    setShowScoreboard(true); // Display scoreboard
  };

  return (
    <UserProvider>
      {/* Start Screen */}
      { !showCountdown && !quizStarted && !showScoreboard && (
        <StartScreen
          onStart={startQuiz}
        />
      )}

      {/* Countdown */}
      { showCountdown && !quizStarted && !showScoreboard && (
        <CountDown
          onComplete={handleCountdownComplete}
        />
      )}

      {/* Quiz Questions */}
      {quizStarted && !showScoreboard && (
        <Questions
          onGoBack={onGoBack} setQuizStarted// Consistent prop name
        />
      )}

      {/* Quiz Questions */}
      {quizStarted  && (
        <Questions
          onGoBack={onGoBack} setQuizStarted// Consistent prop name
        />
      )}

      {/* Scoreboard */}
      {showScoreboard && (
        <Scoreboard
          onGoBack={onGoBack} // Consistent prop name
        />
      )}

      {/* View Scoreboard Button on Start Screen */}
      {!showCountdown && !quizStarted && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleShowScoreboard}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            View Scoreboard
          </button>
        </div>
      )}
    </UserProvider>
  );
};

export default App;
