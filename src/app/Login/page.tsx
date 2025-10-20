"use client"

import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { APIStatus, LoginContext, LoginContextType } from "../data-context";
import IUser from "../interfaces/IUser";
import IUserData from "../interfaces/IUserData";

import "./Login.css";

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

     const login = (e?: any) => {
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

          axios.defaults.headers.common['wl_username'] = username;
          axios.defaults.headers.common['wl_password'] = password;

          axios.put(`/api/Login`)
               .then((res: AxiosResponse<IUser>) => {
                    if (res.data[0] === "OK") {
                         loginSuccessfullActions(res.data[1]);
                    } else {
                         alert(res.data[1]);
                         setLoginSubmitted(false);
                         setUserNameNeedsFocus(true);
                    }
               })
               .catch((err: Error) => {
                    setLoggedInCheck(APIStatus.Unauthorized);
                    setLoginSubmitted(false);

                    if (String(err.message).startsWith("Unauthorized")) {
                         alert(`Invalid username or password`);
                    } else if (err.message === "Request failed with status code 404") {
                         alert(`An error occurred logging in. Please check the WatchList Backend`);
                    } else {
                         alert(`An error occurred logging in with the error ${err.message}`);
                    }
               });
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