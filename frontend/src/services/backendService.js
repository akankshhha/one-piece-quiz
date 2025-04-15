import axios from "axios";

const BASE_URL = "http://localhost:3001/api"

//get scores
export const getScores = async () => {
    try {
        const result = await axios.get(`${BASE_URL}/scores`)
        return result?.data
    } catch(error) {
        console.error('Failed to fetch scores:', error);
        throw error; 
    }
}

// post scores
export const postScore = async (scoreObj) => {
    try {
        const result = await axios.post(`${BASE_URL}/scores`, scoreObj)
        return result
    } catch(error) {
        console.error('Failed to fetch scores:', error);
        throw error; // Let the caller handle the error
    }
}

// get questions
export const loadQuestions = async() => {
    try {
        const result = await axios.get(`${BASE_URL}/questions`)
        return result?.data
    } catch(error) {
        console.error('Failed to fetch scores:', error);
        throw error; 
    }
}