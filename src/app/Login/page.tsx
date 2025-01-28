"use client"

import axios, { AxiosResponse } from "axios";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import IUser from "../interfaces/IUser";
import IUserData from "../interfaces/IUserData";
import { DataContext, DataContextType } from "../data-context";

import "./Login.css";

export default function Login() {
     const {
          activeRoute,
          darkMode,
          defaultRoute,
          demoPassword,
          demoUsername,
          isLoggedIn,
          isLoggedInCheckComplete,
          setActiveRoute,
          setActiveRouteDisplayName,
          setDemoMode,
          setIsLoggedIn,
          setIsLoggedInCheckComplete,
          setOptions,
          setUserData
     } = useContext(DataContext) as DataContextType

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
          if (e !== null) {
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
               setActiveRouteDisplayName("WatchList");
               setUserData(newUserData);
               setIsLoggedIn(true);
               setIsLoggedInCheckComplete(true);

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
                    setIsLoggedInCheckComplete(true);
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

               newUserData.Admin = response.Admin === true ? true : false;

               setUsername("");
               setPassword("");

               setActiveRoute(defaultRoute);
               setActiveRouteDisplayName(defaultRoute);
               setUserData(newUserData);

               if (typeof response.Options !== "undefined" && response.Options.length === 1) {
                    setOptions(response.Options[0]);
               }

               setIsLoggedIn(true);
               setIsLoggedInCheckComplete(true);

               setTimeout(() => {
                    router.push("/WatchList");
               }, 1000);
          } catch (err) { }
     }, [defaultRoute, setActiveRoute, setIsLoggedIn, setIsLoggedInCheckComplete, setUserData]);

     useEffect(() => {
          if (isLoggedIn && activeRoute === "Login") {
               router.push(defaultRoute);
          }
     }, []);

     useEffect(() => {
          if (userNameNeedsFocus && usernameRef.current) {
               usernameRef.current.focus();
          }
     }, [userNameNeedsFocus]);

     return (
          <>
               {isLoggedInCheckComplete &&
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