"use client"

import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataContext, DataContextType } from "../data-context";

import "../Login/Login.css";
import IUser from "../interfaces/IUser";

export default function Setup() {
     const {
          activeRoute,
          defaultRoute,
          darkMode,
          demoUsername,
          isLoggedIn,
          isLoggedInCheckComplete,
          validatePassword
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     const [confirmPassword, setConfirmPassword] = useState("");
     const [password, setPassword] = useState("");
     const [realname, setRealname] = useState("");
     const [username, setUsername] = useState("");
     const [submitClicked, setSubmitClicked] = useState(false);

     const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter') {
               // Submit when enter is pressed
               setupClickHandler();
          }
     }

     const setupClickHandler = () => {
          if (typeof realname !== "string" || (typeof realname === "string" && (realname === null || realname === ""))) {
               alert("Please enter the name for the user account");
               return;
          }

          if (typeof username !== "string" || (typeof username === "string" && (username === null || username === ""))) {
               alert("Please enter the name for the user account");
               return;
          }

          if (typeof password !== "string" || (typeof password === "string" && (password === null || password === ""))) {
               alert("Please enter the password for the user account");
               return;
          }

          if (typeof confirmPassword !== "string" || (typeof confirmPassword === "string" && (confirmPassword === null || confirmPassword === ""))) {
               alert("Please enter the confirmation password for the user account");
               return;
          }

          if (password !== confirmPassword) {
               alert("The 2 passwords do not match");
               return;
          }

          if (username === demoUsername) {
               alert("You cannot create an account with this username. It is reserved");
               return;
          }

          const validationResult = validatePassword(password);

          if (!validationResult) {
               alert("The password must be at least 8 characters long, contain 2 lower case letters, 1 uppercase letter, 2 numbers and 2 symbols");
               return;
          }

          setSubmitClicked(true);

          // First user account created in this WatchList instance is automatically made an admin
          axios.put(`/api/Setup?wl_username=${encodeURIComponent(username)}&wl_realname=${encodeURIComponent(realname)}&wl_password=${encodeURIComponent(password)}&wl_admin=true`, null)
               .then((res: AxiosResponse<IUser>) => {
                    if (res.data[0] === "OK") {
                         alert("User account was successfully created");

                         router.push("/Login");
                    } else {
                         alert("User account was NOT created. " + res.data[1]);
                         setSubmitClicked(false);
                    }
               })
               .catch((err: Error) => {
                    alert("User account was NOT created. The error " + err.message + " occurred");
                    setSubmitClicked(false);
               });
     };

     useEffect(() => {
          if (activeRoute !== "Setup") {
               router.push(defaultRoute);
          }
     }, []);

     return (
          <>
          {isLoggedInCheckComplete && !isLoggedIn && 
               <div className={`login-page`}>
                    <div className="form">
                         <form className="login-form">
                              <span className={`login-label ${!darkMode ? " lightMode" : " darkMode"}`}>WatchList Setup</span>

                              <input type="text" autoFocus disabled={submitClicked} value={realname} placeholder="Name" required onChange={(event) => setRealname(event.target.value)} onKeyUp={handleKeyUp} />
                              <input type="text" autoFocus disabled={submitClicked} value={username} placeholder="Username" required onChange={(event) => setUsername(event.target.value)} onKeyUp={handleKeyUp} />

                              <input type="password" autoFocus disabled={submitClicked} value={password} placeholder="Password" required onChange={(event) => setPassword(event.target.value)} onKeyUp={handleKeyUp} />

                              <input type="password" autoFocus disabled={submitClicked} value={confirmPassword} placeholder="Confirm password" required onChange={(event) => setConfirmPassword(event.target.value)} onKeyUp={handleKeyUp} />

                              {!submitClicked &&
                                   <button type="button" onClick={setupClickHandler}>
                                        Create new Account
                                   </button>
                              }
                         </form>
                    </div>
               </div>
}
          </>
     )
}