const axios = require("axios");
const exact = require ("prop-types-exact");
const IUser = require("../interfaces/IUser");
const PropTypes = require("prop-types");
const React = require("react");
const useEffect = require("react").useEffect;
const useNavigate = require("react-router-dom").useNavigate;
const useCallback = require("react").useCallback;
const useState = require("react").useState;

import "./Login.css";

const Login = ({  defaultRoute, setIsLoggedIn, setActiveRoute, setIsLoggedInCheckComplete, setUserData }
     :
     {
          defaultRoute: string,
          setIsLoggedIn: (arg0: boolean) => void,
          setActiveRoute: (arg0: string) => void,
          setIsLoggedInCheckComplete: (arg0: boolean) => void,
          setUserData: (arg0: typeof IUser) => void
     }) => {
          const navigate = useNavigate();

          const [backendURL, setBackendURL] = useState("");
          const [password, setPassword] = useState("");
          const [username, setUsername] = useState("");

          const backendURLChangeHandler= (newBackendURL: string) => {
               if (newBackendURL.endsWith("/")) {
                    newBackendURL = newBackendURL.slice(0,-1);
               }

               setBackendURL(newBackendURL);
          }

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

               if (backendURL === null || backendURL === "") {
                    alert("Please enter the backendURL");
                    return;
               }

               // If you do not set this, when you hit refresh after logging in, you will be redirected to the login screen and admin doesnt show up.
               localStorage.setItem("WatchList.BackendURL", backendURL);

               axios.get(`${backendURL}/Login?wl_username=${username}&wl_password=${password}`)
               .then((res: typeof IUser) => {
                    if (res.data[0] === "OK") {
                         loginSuccessfullActions(res.data[1][0][0]);
                    } else {
                         alert("Login failed. Please check your username and password");
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
               // This should never happen
               if (backendURL === null || backendURL === "") {
                    alert("Please enter the backendURL");
                    return;
               }

               const newUserData : typeof IUser = [];

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

                    newUserData.BackendURL = backendURL;

                    setActiveRoute(defaultRoute);
                    setUserData(newUserData);
                    setIsLoggedIn(true);
                    setIsLoggedInCheckComplete(true);
                    navigate("/WatchList");
               } catch (err) {}
               },
          [backendURL]);

          useEffect(() => {
               if (typeof localStorage.getItem("WatchList.BackendURL") === "string") {
                    setBackendURL(localStorage.getItem("WatchList.BackendURL"));
               } else if (window.location.origin.startsWith("http://")) {
                    setBackendURL(window.location.origin);
               }
          }, []);

          return (
               <div className="login-page">
                    <div className="form">
                         <form className="login-form">
                              <span className="login-label">WatchList Login</span>
                              <input type="text" autoFocus value={username} placeholder="username" required onChange={(event) => setUsername(event.target.value)} onKeyUp={handleKeyUp} />
                              <input type="password" value={password} placeholder="password" required onChange={(event) => setPassword(event.target.value)} onKeyUp={handleKeyUp} />

                              <input type="text" value={backendURL} placeholder="Backend URL" required onChange={(event) => backendURLChangeHandler(event.target.value)} onKeyUp={handleKeyUp}></input>

                              <button type="button" onClick={login}>
                                   Login
                              </button>
                         </form>
                    </div>
               </div>
          );
};

Login.propTypes = exact({
     defaultRoute: PropTypes.string.isRequired,
     setActiveRoute: PropTypes.func.isRequired,
     setIsLoggedIn: PropTypes.func.isRequired,
     setIsLoggedInCheckComplete: PropTypes.func.isRequired,
     setUserData: PropTypes.func.isRequired,
});

export default Login;