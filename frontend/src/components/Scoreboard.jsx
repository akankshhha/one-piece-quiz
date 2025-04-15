import React, { useEffect, useState, useRef } from 'react';
import { getScores } from '../services/backendService';
import '../App.css'
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
          stagger: 0.1, 
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
      <div className='rounded-xl border-2 border-gray-600'>
      <table className="w-full border-collapse shadow-sm text-xl">
        <thead>
          <tr className='border-b-2 border-gray-600'>
            <th className="font-medium px-4 py-2">Rank</th>
            <th className="font-medium px-4 py-2">Username</th>
            <th className="font-medium px-4 py-2">Score</th>
            <th className="font-medium px-4 py-2">Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {scores?.length > 0 ? (
            scores?.map((entry, index) => (
              <tr key={index} className="text-center hover:bg-gray-600 transition border-b-2 border-gray-600" ref={(el) => (rowsRef.current[index] = el)}>
        
               {
                index <= 2 ?  
                <td className='flex items-center justify-center'>
                  {
                    index === 0 ? <img src={`assets/first.png`} className='badge' alt="first" /> 
                    : index ===1 ? <img src={`assets/second.png`} alt="second" className='badge' /> 
                    : <img src={`assets/third.png`} alt="third" className='badge'/>
                  } 
                </td> :
                 <td className="px-4 py-2">{index + 1}</td>
                }
                
                <td className="px-4 py-2 text-yellow-400">{entry.username}</td>
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
     
    </div>
  );
};

export default ScoreboardPage;
