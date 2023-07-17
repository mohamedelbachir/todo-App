import React from 'react'
import { useState } from 'react';
import { createContext } from "react";

export const ThemeContext=createContext()

function ThemeContextProvider(props) {
    const [themeState,setThemeState]=useState(localStorage.getItem("theme")||"light")
    const toogleTheme=function(){
        if(themeState==='dark'){
            setThemeState('light')
            localStorage.setItem("theme","light")
        }else{
            setThemeState('dark')
            localStorage.setItem("theme","dark")
        }
    }
    return (
        <ThemeContext.Provider value={{themeState,toogleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider