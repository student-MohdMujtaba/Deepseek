"use client";
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext } from "react";

export const AppContext = createContext();

export const userAppContext = () => {
    return useContext(AppContext)
}


export const AppContextProvider = ({children}) => {
    const {user} = useUser();

    const value = {
        user
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}