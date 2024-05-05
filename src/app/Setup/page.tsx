"use client"

const axios = require("axios");
const IUser = require("../interfaces/IUser");
const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

export default function Setup() {
     const {
          activeRoute,
          defaultRoute,
          demoUsername,
          validatePassword
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     const [confirmPassword, setConfirmPassword] = useState("");
     const [password, setPassword] = useState("");
     const [realname, setRealname] = useState("");
     const [username, setUsername] = useState("");

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

          axios.put(`/api/Setup?wl_username=${username}&wl_realname=${realname}&wl_password=${password}&wl_isadmin=true`, null)
               .then((res: typeof IUser) => {
                    if (res.data[0] === "OK") {
                         alert("User account was successfully created");

                         router.push("/Login");
                    } else {
                         alert("User account was NOT created. " + res.data[1]);
                    }
               })
               .catch(() => { });
     };

     useEffect(() => {
          if (activeRoute !== "Setup") {
               router.push(defaultRoute);
          }
     }, []);

     return (
          <>
               <div className="login-page">
                    <div className="form">
                         <form className="login-form">
                              <span className="login-label">WatchList Setup</span>

                              <input className="topMargin" type="text" autoFocus value={realname} placeholder="Name" required onChange={(event) => setRealname(event.target.value)} />
                              <input className="topMargin" type="text" autoFocus value={username} placeholder="Username" required onChange={(event) => setUsername(event.target.value)} />

                              <input className="topMargin" type="password" autoFocus value={password} placeholder="Password" required onChange={(event) => setPassword(event.target.value)} />

                              <input className="topMargin" type="password" autoFocus value={confirmPassword} placeholder="Confirm password" required onChange={(event) => setConfirmPassword(event.target.value)} />

                              <button className="topMargin" type="button" onClick={setupClickHandler}>
                                   Create new Account
                              </button>
                         </form>
                    </div>
               </div>
          </>
     )
}