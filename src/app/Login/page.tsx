"use client"

import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { APIStatus, LoginContext } from "../data-context";
import IUser from "../interfaces/IUser";
import IUserData from "../interfaces/IUserData";

import "./Login.css";
import { LoginContextType } from "../interfaces/contexts/LoginContextType";

export default function Login() {
     const {
          activeRoute, darkMode, defaultRoute, demoPassword, demoUsername, loggedInCheck, setActiveRoute, setDemoMode, setLoggedInCheck, setOptions, setUserData
     } = useContext(LoginContext) as LoginContextType

     const [password, setPassword] = useState("");
     const [username, setUsername] = useState("");
     const [loginSubmitted, setLoginSubmitted] = useState(false);
     const [userNameNeedsFocus, setUserNameNeedsFocus] = useState(false);

     const usernameRef: any = useRef(null)

     const router = useRouter();

     const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter') {
               // Submit when enter is pressed
               login();
          }
     }

     const login = async (e?: any) => {
          if (typeof e !== "undefined") {
               e.preventDefault();
          }

          if (username === null || username === "") {
               alert("Please enter the username");
               return;
          }

          if (password === null || password === "") {
               alert("Please enter the password");
               return;
          }

          setLoginSubmitted(true);

          if (username === demoUsername && password === demoPassword) {
               setDemoMode(true);

               const newUserData: IUser = require("../demo/index").demoUsers[0];

               setActiveRoute("WatchList");
               setUserData(newUserData);
               setLoggedInCheck(APIStatus.Success);

               setTimeout(() => {
                    router.push("/WatchList");
               }, 1000);

               return;
          }

          try {
               const loginResponse = await fetch(`/api/Login`, { headers: { wl_username: username, wl_password: password }, method: 'PUT', credentials: 'include' });

               const loginResult = await loginResponse.json();

               if (loginResult[0] === "OK") {
                    loginSuccessfullActions(loginResult[1]);
               } else {
                    alert(loginResult[1]);
                    setLoginSubmitted(false);
                    setUserNameNeedsFocus(true);
               }
          } catch (e) {
               alert(e.message);
               setLoginSubmitted(false);
               setUserNameNeedsFocus(true);
          }
     };

     const loginSuccessfullActions = useCallback(async (response: IUser) => {
          const newUserData: IUserData = { UserID: 0, Username: "", Admin: false };

          try {
               if (typeof response.UserID !== "undefined") {
                    newUserData.UserID = response.UserID;
               }

               if (typeof response.Username !== "undefined") {
                    newUserData.Username = response.Username;
               }

               if (typeof response.Realname !== "undefined") {
                    newUserData.Realname = response.Realname;
               }

               newUserData.Admin = response.Admin;

               setUsername("");
               setPassword("");

               setActiveRoute(defaultRoute);
               setUserData(newUserData);

               if (typeof response.Options !== "undefined" && response.Options.length === 1) {
                    setOptions(response.Options[0]);
               }

               setLoggedInCheck(APIStatus.Success);

               setTimeout(() => {
                    router.push("/WatchList");
               }, 1000);
          } catch (err) { }
     }, [defaultRoute, router, setActiveRoute, setLoggedInCheck, setOptions, setUserData]);

     useEffect(() => {
          if (loggedInCheck === APIStatus.Success && activeRoute === "Login") {
               router.push(defaultRoute);
          }
     }, [activeRoute, defaultRoute, loggedInCheck, router]);

     useEffect(() => {
          if (userNameNeedsFocus && usernameRef.current) {
               usernameRef.current.focus();
          }
     }, [userNameNeedsFocus]);

     return (
          <>
               {(loggedInCheck === APIStatus.Idle || loggedInCheck === APIStatus.Unauthorized) &&
                    <div className={`login-page`}>
                         <div className="form">
                              <form className="login-form" onSubmit={login}>
                                   <span className={`login-label ${!darkMode ? " lightMode" : " darkMode"}`}>WatchList Login</span>
                                   <input type="text" autoFocus disabled={loginSubmitted} value={username} placeholder="username" required onChange={(event) => setUsername(event.target.value)} onKeyUp={handleKeyUp} ref={usernameRef} />
                                   <input type="password" disabled={loginSubmitted} value={password} placeholder="password" required onChange={(event) => setPassword(event.target.value)} onKeyUp={handleKeyUp} />

                                   {!loginSubmitted &&
                                        <button type="submit">
                                             Login
                                        </button>
                                   }
                              </form>
                         </div>
                    </div>
               }
          </>
     )
}