"use client"

const axios = require("axios");
const IUser = require("../interfaces/IUser");
const React = require("react");
const useCallback = require("react").useCallback;
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

import "./Login.css";

export default function Login() {
     const {
          activeRoute,
          defaultRoute,
          demoPassword,
          demoUsername,
          isLoggedIn,
          setActiveRoute,
          setActiveRouteDisplayName,
          setDemoMode,
          setIsLoggedIn,
          setIsLoggedInCheckComplete,
          setUserData
     } = useContext(DataContext) as DataContextType

     const [password, setPassword] = useState("");
     const [username, setUsername] = useState("");

     const router = useRouter();

     const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter') {
               // Submit when enter is pressed
               login();
          }
     }

     const login = () => {
          if (username === null || username === "") {
               alert("Please enter the username");
               return;
          }

          if (password === null || password === "") {
               alert("Please enter the password");
               return;
          }

          if (username === demoUsername && password === demoPassword) {
               setDemoMode(true);

               const newUserData: typeof IUser = require("../demo/index").demoUser[0];

               setActiveRoute("WatchList");
               setActiveRouteDisplayName("WatchList");
               setUserData(newUserData);
               setIsLoggedIn(true);
               setIsLoggedInCheckComplete(true);

               localStorage.setItem("watchlist_demomode", "true");
               return;
          }

          axios.defaults.headers.common['wl_username'] = username;
          axios.defaults.headers.common['wl_password'] = password;

          axios.put(`/api/Login`)
               .then((res: typeof IUser) => {
                    if (res.data[0] === "OK") {
                         loginSuccessfullActions(res.data[1]);
                    } else {
                         alert(res.data[1]);
                    }
               })
               .catch((err: Error) => {
                    setIsLoggedInCheckComplete(true);

                    if (String(err.message).startsWith("Unauthorized")) {
                         alert(`Invalid username or password`);
                    } else if (err.message === "Request failed with status code 404") {
                         alert(`An error occurred logging in. Please check the WatchList URL`);
                    } else {
                         alert(`An error occurred logging in with the error ${err.message}`);
                    }
               });
     };

     const loginSuccessfullActions = useCallback((response: typeof IUser) => {
          const newUserData: typeof IUser = [];

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

               newUserData.Admin = response.Admin === 1 ? true : false;

               setActiveRoute(defaultRoute);
               setActiveRouteDisplayName(defaultRoute);
               setUserData(newUserData);
               setIsLoggedIn(true);
               setIsLoggedInCheckComplete(true);
          } catch (err) { }
     }, [defaultRoute, setActiveRoute, setIsLoggedIn, setIsLoggedInCheckComplete, setUserData]);

     useEffect(() => {
          if (isLoggedIn && activeRoute === "Login") {
               router.push(defaultRoute);
          }
     }, []);

     return (
          <>
               <div className="login-page">
                    <div className="form">
                         <form className="login-form">
                              <span className="login-label">WatchList Login</span>
                              <input type="text" autoFocus value={username} placeholder="username" required onChange={(event) => setUsername(event.target.value)} onKeyUp={handleKeyUp} />
                              <input type="password" value={password} placeholder="password" required onChange={(event) => setPassword(event.target.value)} onKeyUp={handleKeyUp} />

                              <button type="button" onClick={login}>
                                   Login
                              </button>
                         </form>
                    </div>
               </div>
          </>
     )
}