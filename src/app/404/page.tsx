"use client"

import { useContext } from "react";
import { useRouter } from 'next/navigation';

import { ErrorContext } from "../data-context";
import { ErrorContextType } from "../interfaces/contexts/ErrorContextType";

export default function ErrorPage() {
     const {
          darkMode, defaultRoute, errorMessage, setActiveRoute
     } = useContext(ErrorContext) as ErrorContextType

     const router = useRouter();

     const goHomeClick = () => {
          setActiveRoute(defaultRoute);

          router.push("/" + defaultRoute);
     }

     return (
          <div className={`${!darkMode ? " lightMode" : " darkMode"}`}>
               <span>
                    <img src="/404.jpg" alt="Uh oh. Something went wrong" />

                    <br /><br />

                    <a className={`clickable largeText ${!darkMode ? " lightMode" : " darkMode"}`} onClick={goHomeClick}>Go Home</a>

                    <h1>{errorMessage}</h1>
               </span>
          </div>
     )
}