"use client"

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from "react";

import { DataContext, DataContextType } from "../data-context";

export default function ErrorPage() {
     const {
          darkMode,
          errorMessage
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     useEffect(() => {
          if (errorMessage !== "") {
               throw new Error(errorMessage);
          }
     }, [errorMessage]);

     return (
          <div className={`${!darkMode ? " lightMode" : " darkMode"}`}>
               <span>
                    <img src="/404.jpg" alt="Uh oh. Something went wrong" />

                    <br /><br />

                    <a className={`clickable largeText ${!darkMode ? " lightMode" : " darkMode"}`} onClick={() => router.push("/")}>Go Home</a>

                    <h1>{errorMessage}</h1>
               </span>
          </div>
     )
}