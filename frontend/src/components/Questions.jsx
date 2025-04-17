import React, { useState, useEffect, useRef, useCallback } from "react";
import questions from "../utilities/static data/questions";
import Typewriter from "typewriter-effect";
import { postScore } from "../services/backendService";
import { useUser } from "./context/UserContext";
import Ripples from "react-ripples";
import gsap from "gsap";

const Questions = ({ onGoBack }) => {
  const { userName, setUsername } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCalculatedTime, setShowCalculatedTime] = useState(false);
  const [quizState, setQuizState] = useState({
    completed: false,
    timeTaken: 0,
    questionTimer: 15,
    quizTimer: 150
  });
  
  const cardRef = useRef(null);
  const questionIntervalRef = useRef(null);
  const quizIntervalRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle Quiz Completion
  const handleQuizCompletion = useCallback(async () => {
    const timeUsed = 150 - quizState.quizTimer;

    // Stop all timers
    clearInterval(questionIntervalRef.current);
    clearInterval(quizIntervalRef.current);
    
    // Update state
    setQuizState(prev => ({
      ...prev,
      completed: true,
      timeTaken: timeUsed
    }));

    try {
      await postScore({
        username: userName,
        score: score,
        time_taken: timeUsed,
      });

      setUsername("");
    } catch (err) {
      console.error("Failed to post score:", err);
    }
  }, [quizState.quizTimer, score, userName, setUsername]);

  // Handle Next Question with animation
  const handleTransitionToNextQuestion = useCallback(() => {
    // Zoom out animation
    gsap.to(cardRef.current, {
      scale: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        // Check if the selected answer is correct
        if (selectedOption === currentQuestion.answer) {
          setScore(prevScore => prevScore + 1);
        }
  
        if (isLastQuestion) {
          handleQuizCompletion();
        } else {
          // Move to next question and reset states
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setSelectedOption(null);
          setShowAnswer(false);
          setQuizState(prev => ({ ...prev, questionTimer: 15 }));
        }
  
        // Zoom in animation for the new question
        gsap.fromTo(
          cardRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "power3.out" }
        );
      },
    });
  }, [selectedOption, currentQuestion, isLastQuestion, handleQuizCompletion]);
  

  // Handle Option Selection
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  // Initialize question timer
  useEffect(() => {
    if (quizState.completed) return;
    
    if (quizState.questionTimer > 0) {
      questionIntervalRef.current = setInterval(() => {
        setQuizState(prev => ({ ...prev, questionTimer: prev.questionTimer - 1 }));
      }, 1000);

      return () => clearInterval(questionIntervalRef.current);
    } else {
      // Time's up for this question, move to next
      handleTransitionToNextQuestion();
    }
  }, [quizState.questionTimer, quizState.completed, handleTransitionToNextQuestion]);

  // Initialize quiz timer
  useEffect(() => {
    if (quizState.completed) return;
    
    if (quizState.quizTimer > 0) {
      quizIntervalRef.current = setInterval(() => {
        setQuizState(prev => ({ ...prev, quizTimer: prev.quizTimer - 1 }));
      }, 1000);
      return () => clearInterval(quizIntervalRef.current);
    } else {
      // Overall quiz time is up
      handleQuizCompletion();
    }
  }, [quizState.quizTimer, quizState.completed, handleQuizCompletion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(questionIntervalRef.current);
      clearInterval(quizIntervalRef.current);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {/* End Quiz Button */}
      {!quizState.completed && (
        <button
          onClick={handleQuizCompletion}
          className="absolute top-4 left-4 px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 font-medium transition-all duration-200"
        >
          End Quiz
        </button>
      )}

      {/* Quiz Timer */}
      <div
        className={`absolute top-4 right-4 text-4xl transition-opacity delay-700 duration-200 ease-out ${
          quizState.quizTimer < 30 ? "text-red-500" : "text-cream-yellow"
        } ${!showCalculatedTime ? "opacity-100" : "opacity-0"}`}
      >
        {formatTime(quizState.quizTimer)}
      </div>

      {!quizState.completed ? (
        <div
          className="relative p-8 bg-almost-black rounded-lg shadow-lg w-[600px] h-auto flex flex-col justify-between overflow-hidden"
          ref={cardRef}
        >
          {/* Question Timer */}
          <div
            className={`text-center mb-4 text-lg ${
              quizState.questionTimer < 5 ? "text-red-500" : "text-cream-yellow"
            }`}
          >
            {formatTime(quizState.questionTimer)}
          </div>

          {/* Question Bubble */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-gray-600 flex items-center justify-center rounded-full text-4xl font-bold shadow-md">
            {currentQuestionIndex + 1}
          </div>

          {/* Question */}
          <h2 className="text-2xl mb-6 text-center">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.answer;
              const isSelected = option === selectedOption;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`flex items-center py-3 px-4 rounded-md text-lg font-medium transition-all duration-200
                    ${
                      isSelected
                        ? isCorrect
                          ? "bg-green-100 text-green-700 border border-green-500"
                          : "bg-red-100 text-red-700 border border-red-500"
                        : "bg-gray-700 hover:bg-gray-500"
                    }`}
                  disabled={showAnswer}
                >
                  {isSelected && (
                    <span className="mr-3 text-xl">
                      {isCorrect ? "✅" : "❌"}
                    </span>
                  )}
                  {option}
                </button>
              );
            })}
          </div>

          {/* Next Question Button */}
          <Ripples>
            <button
              onClick={handleTransitionToNextQuestion}
              className={`py-3 mt-6 rounded-md font-medium transition-all duration-200 hover:bg-slate-700 w-1/4 m-auto ${
                isLastQuestion ? "text-yellow-400" : ""
              }`}
            >
              {isLastQuestion ? "Finish" : "Next Question"}
            </button>
          </Ripples>
        </div>
      ) : (
        <div className="p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] w-[650px] h-auto flex flex-col items-center justify-center mb-6 backdrop-blur-md bg-white/10 border border-white/20 transform transition-transform duration-300">
          <h1 className="text-3xl mb-4 text-white drop-shadow-md">
            Quiz Completed!
          </h1>
          <p className="text-xl mb-4 text-white/90">
            Your Score: {score}/{questions.length}
          </p>
          <div className="text-xl mb-8 text-white/90 flex text-left">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("You completed the quiz in ")
                  .pauseFor(100)
                  .callFunction(() => setShowCalculatedTime(true))
                  .changeCursor(" ")
                  .start();
              }}
              options={{
                cursor: "_",
                delay: 40,
              }}
            />

            <span
              className={`text-yellow-400 ml-1 transition-opacity delay-700 duration-200 ease-in ${
                showCalculatedTime ? "opacity-100" : "opacity-0"
              }`}
            >
              {" "}
              {Math.floor(quizState.timeTaken / 60)}min {quizState.timeTaken % 60}sec
            </span>
          </div>
          <Ripples>
            <button
              onClick={onGoBack}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-almost-black font-semibold shadow-md hover:bg-yellow-400 active:scale-95 transition-all duration-200"
            >
              Restart Quiz
            </button>
          </Ripples>
        </div>
      )}
    </div>
  );
};

export default Questions;
