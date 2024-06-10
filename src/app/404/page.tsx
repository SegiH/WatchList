"use client"
const useContext = require("react").useContext;
const useRouter = require("next/navigation").useRouter;

import { DataContext, DataContextType } from "../data-context";

export default function ErrorPage() {
     const {
          isErrorMessage
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     return (
          <div className="foregroundColor">
               <span>
                    <img src="/404.jpg" alt="Uh oh. Something went wrong" />

                    <br /><br />

                    <a className="clickable foregroundColor largeText" onClick={() => router.push("/")}>Go Home</a>

                    <h1>{isErrorMessage}</h1>
               </span>
          </div>
     )
}