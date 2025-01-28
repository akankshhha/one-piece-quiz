import React, { useState, useEffect, useRef, useCallback } from "react";
import questions from "../utilities/static data/questions";
import { postScore } from "../services/scoreBoardService";
import { useUser } from "./context/UserContext";

const Questions = ({ onGoBack }) => {
  const { userName, setUsername } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  // Timer states
  const [questionTimer, setQuestionTimer] = useState(30);
  const [quizTimer, setQuizTimer] = useState(300);

  // Final Results
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Timer references
  const questionIntervalRef = useRef(null);
  const quizIntervalRef = useRef(null);

  // Handle Quiz Completion
  const handleQuizCompletion = useCallback(async () => {
    const timeUsed = 300 - quizTimer;
    setTimeTaken(timeUsed);
    setQuizCompleted(true);

    // Stop timers
    clearInterval(questionIntervalRef.current);
    clearInterval(quizIntervalRef.current);


    try {
      await postScore({ username: userName, score: score, time_taken: timeUsed });
      // alert(`Score added successfully! ID: ${record?.data?.id}`);

      setUsername(""); // Clear any previous errors
    } catch (err) {
        // alert("Failed to submit score. Please try again.");
        console.error(err);
    }

  }, [quizTimer, score, userName, setUsername]);

  // Handle Next Question
  const handleNextQuestion = useCallback(() => {
    if (selectedOption === currentQuestion.answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setQuestionTimer(30);
    } else {
      handleQuizCompletion();
    }
  }, [
    selectedOption,
    currentQuestionIndex,
    currentQuestion,
    handleQuizCompletion,
  ]);

  // Countdown for question timer
  useEffect(() => {
    if (questionTimer > 0 && !quizCompleted) {
      questionIntervalRef.current = setInterval(() => {
        setQuestionTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(questionIntervalRef.current);
    } else if (questionTimer === 0) {
      handleNextQuestion();
    }
  }, [questionTimer, quizCompleted, handleNextQuestion]);

  // Countdown for total quiz timer
  useEffect(() => {
    if (quizTimer > 0 && !quizCompleted) {
      quizIntervalRef.current = setInterval(() => {
        setQuizTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(quizIntervalRef.current);
    } else if (quizTimer === 0) {
      handleQuizCompletion();
    }
  }, [quizTimer, quizCompleted, handleQuizCompletion]);


  // Handle Option Selection
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white relative">
      {/* End Quiz Button */}
      {!quizCompleted && (
        <button
          onClick={handleQuizCompletion}
          className="absolute top-4 left-4 px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200"
        >
          End Quiz
        </button>
      )}

      {/* Quiz Timer */}
      <div className="absolute top-4 right-4 text-2xl">
        {formatTime(quizTimer)}
      </div>

      {!quizCompleted ? (
        <div className="relative p-8 bg-almost-black rounded-lg shadow-lg w-[600px] h-auto flex flex-col justify-between overflow-hidden">
          {/* Question Timer */}
          <div className="text-center mb-4 text-lg text-red-500">
            {formatTime(questionTimer)}
          </div>

          {/* Question Bubble */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-gray-600 text-white flex items-center justify-center rounded-full text-4xl font-bold shadow-md">
            {currentQuestionIndex + 1}
          </div>

          {/* Question */}
          <h2 className="text-2xl mb-6 text-center">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.answer;
              const isSelected = option === selectedOption;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`flex items-center w-full py-3 px-4 rounded-md text-lg font-medium transition-all duration-200 
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
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 mt-6 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish"
              : "Next Question"}
          </button>
        </div>
      ) : (
        ""
      )}
      {quizCompleted && (
        <div className="p-8 bg-gray-600 rounded-lg shadow-lg w-[650px] h-auto flex flex-col items-center justify-center mb-6">
          <h1 className="text-3xl mb-4">
            Quiz Completed!
          </h1>
          <p className="text-xl mb-4">
            Your Score: {score}/{questions.length}
          </p>
          <p className="text-xl mb-8">
            Time Taken: {Math.floor(timeTaken / 60)} minutes and{" "}
            {timeTaken % 60} seconds
          </p>
          <button
            onClick={onGoBack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Questions;
