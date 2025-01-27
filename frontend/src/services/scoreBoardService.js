import axios from "axios";

const BASE_URL = "http://localhost:3001/api/scores"

//get scores
export const getScores = async () => {
    try {
        const result = await axios.get(BASE_URL)
        return result?.data
    } catch(error) {
        console.error('Failed to fetch scores:', error);
        throw error; 
    }
}

// post scores
export const postScore = async (scoreObj) => {
    try {
        const result = await axios.post(BASE_URL, scoreObj)
        console.log(result?.data)
        return result
    } catch(error) {
        console.error('Failed to fetch scores:', error);
        throw error; // Let the caller handle the error
    }
}