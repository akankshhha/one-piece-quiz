import { createContext, useContext, useState } from "react";

// Create a context
const UserContext = createContext()

// Creating a provider component
export const UserProvider = ({ children }) => {
    const [userName, setUsername] = useState("")
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    return(
        <UserContext.Provider value={{ userName, setUsername, selectedCharacter, setSelectedCharacter }}>
            { children }
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);



