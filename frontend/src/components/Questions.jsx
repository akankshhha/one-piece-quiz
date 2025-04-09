import React, { useState, useEffect, useRef, useCallback } from "react";
import questions from "../utilities/static data/questions";
import Typewriter from "typewriter-effect";
import { postScore } from "../services/scoreBoardService";
import { useUser } from "./context/UserContext";
import gsap from "gsap";

const Questions = ({ onGoBack }) => {
  const { userName, setUsername } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCalculatedTime, setShowCalculatedTime] = useState(false)
  const cardRef = useRef(null)

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

      setUsername(""); 
    } catch (err) {
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

  const handleTransitionToNextQuestion = () => {
    // Zoom out animation
    gsap.to(cardRef.current, {
      scale: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        // Call the handler to proceed to the next question
        handleNextQuestion();

        // Zoom in animation for the new question
        gsap.fromTo(
          cardRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "power3.out" }
        );
      },
    });
  };

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
    <div className="h-screen flex flex-col items-center justify-center relative">
      {/* End Quiz Button */}
      {!quizCompleted && (
        <button
          onClick={handleQuizCompletion}
          className="absolute top-4 left-4 px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 font-medium transition-all duration-200"
        >
          End Quiz
        </button>
      )}

      {/* Quiz Timer */}
     <div className={`absolute top-4 right-4 text-4xl transition-opacity delay-700 duration-200 ease-out ${quizTimer < 60 ? 'text-red-500' : 'text-cream-yellow'} ${!showCalculatedTime ? 'opacity-100' : 'opacity-0'}`}>
        {formatTime(quizTimer)}
      </div>

      {!quizCompleted ? (
        <div className="relative p-8 bg-almost-black rounded-lg shadow-lg w-[600px] h-auto flex flex-col justify-between overflow-hidden" ref={cardRef}>
          {/* Question Timer */}
          <div className={ `text-center mb-4 text-lg ${questionTimer < 10 ? 'text-red-500' : 'text-cream-yellow'}`}>
            {formatTime(questionTimer)}
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
          <span className="mr-3 text-xl">{isCorrect ? "✅" : "❌"}</span>
        )}
        {option}
      </button>
    );
  })}
</div>


          {/* Next Question Button */}
          <button
            onClick={handleTransitionToNextQuestion}
            className="w-full py-3 mt-6 rounded-md font-medium transition-all duration-200"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish"
              : "Next Question"}
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] w-[650px] h-auto flex flex-col items-center justify-center mb-6 backdrop-blur-md bg-white/10 border border-white/20 transform transition-transform duration-300">
        <h1 className="text-3xl mb-4 text-white drop-shadow-md">
          Quiz Completed!
        </h1>
        <p className="text-xl mb-4 text-white/90">
          Your Score: {score}/{questions.length}
        </p>
        <p className="text-xl mb-8 text-white/90 flex">
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
         
          <span className={`text-yellow-400 ml-1 transition-opacity delay-700 duration-200 ease-in ${showCalculatedTime ? 'opacity-100' : 'opacity-0'}`}>{' '} {Math.floor(timeTaken / 60)}min {timeTaken % 60}sec</span>
        </p>
        <button
          onClick={onGoBack}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-almost-black font-semibold shadow-md hover:bg-yellow-400 active:scale-95 transition-all duration-200"
        >
          Restart Quiz
        </button>
      </div>
      
      )}
    </div>
  );
};

export default Questions;
