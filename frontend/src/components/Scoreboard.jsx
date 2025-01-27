import React, { useEffect, useState } from 'react';
import { getScores } from '../services/scoreBoardService';

const ScoreboardPage = ({ onGoBack }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    getScores().then((res) => setScores(res))
  }, [])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">Scoreboard</h1>

      {/* Scoreboard Table */}
      <table className="w-full table-auto border-collapse border border-gray-300 shadow-sm mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Rank</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
            <th className="border border-gray-300 px-4 py-2">Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {scores?.length > 0 ? (
            scores?.map((entry, index) => (
              <tr key={index} className="text-center hover:bg-gray-50 transition">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.username}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.time_taken}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 px-4 py-6 text-center">
                No scores available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Go Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onGoBack}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ScoreboardPage;
