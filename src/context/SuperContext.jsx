import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const SuperContext = createContext();


export const SuperProvider = ({children})=>{

    const getFromLocalStorage = (key,def)=>{
        const stored = localStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : def;
    }

    const [loggedIn, setLoggedIn] = useState(()=>getFromLocalStorage('loginStatus',false));

    useEffect(()=>{
      localStorage.setItem('loginStatus',JSON.stringify(loggedIn));
      console.log('loginStatus',localStorage.getItem('loginStatus'));
    },[loggedIn])

    return(
        <SuperContext.Provider value={{loggedIn, setLoggedIn}}>
            {children}
        </SuperContext.Provider>
    )
}

export const useSuperContext = ()=> useContext(SuperContext);