"use client"

import { useContext } from "react";

import { DataContext, DataContextType } from "../data-context";

export default function ErrorPage() {
     const {
          darkMode,
          errorMessage,
          setActiveRoute
     } = useContext(DataContext) as DataContextType

     return (
          <div className={`${!darkMode ? " lightMode" : " darkMode"}`}>
               <span>
                    <img src="/404.jpg" alt="Uh oh. Something went wrong" />

                    <br /><br />

                    <a className={`clickable largeText ${!darkMode ? " lightMode" : " darkMode"}`} onClick={() => setActiveRoute("")}>Go Home</a>

                    <h1>{errorMessage}</h1>
               </span>
          </div>
     )
}