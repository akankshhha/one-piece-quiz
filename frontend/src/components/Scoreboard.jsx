import React, { useEffect, useState, useRef } from 'react';
import { getScores } from '../services/scoreBoardService';
import gsap from 'gsap';

const ScoreboardPage = () => {
  const [scores, setScores] = useState([]);
  const rowsRef = useRef([]);

  useEffect(() => {
    getScores().then((res) => setScores(res))
  }, [])

  useEffect(() => {
    if (rowsRef.current.length > 0) {
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.2, 
          duration: 0.6,
          ease: "power3.out",
        }
      );
    }
  }, [scores]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl mb-6 text-center">Scoreboard</h1>

      {/* Scoreboard Table */}
      <table className="w-full table-auto border-collapse border-2 border-gray-500 shadow-sm mb-6 text-xl">
        <thead>
          <tr className='border-b-2 border-gray-500'>
            <th className=" px-4 py-2">Rank</th>
            <th className=" px-4 py-2">Username</th>
            <th className=" px-4 py-2">Score</th>
            <th className=" px-4 py-2">Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {scores?.length > 0 ? (
            scores?.map((entry, index) => (
              <tr key={index} className="text-center hover:bg-gray-700 transition" ref={(el) => (rowsRef.current[index] = el)}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{entry.username}</td>
                <td className="px-4 py-2">{entry.score}</td>
                <td className="px-4 py-2">{entry.time_taken}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center">
                No scores available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreboardPage;
