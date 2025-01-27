import { createContext, useContext, useState } from "react";

// Create a context
const UserContext = createContext()

// Creating a provider component
export const UserProvider = ({ children }) => {
    const [userName, setUsername] = useState("")
    const [scoreboard, setScoreboard] = useState([])

    const addToScoreboard = async (score, timeTaken) => {
        const newEntry = {userName, score, timeTaken}
       
        const updatedScoreboard = [...scoreboard, newEntry]

        updatedScoreboard.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken)
        setScoreboard(updatedScoreboard)
    }

    return(
        <UserContext.Provider value={{ userName, setUsername, scoreboard, addToScoreboard }}>
            { children }
        </UserContext.Provider>
    )
}

// Custom hook to use the context

export const useUser = () => useContext(UserContext);



