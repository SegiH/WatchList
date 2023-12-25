const axios = require("axios");
const exact = require ("prop-types-exact");
const IUser = require("../interfaces/IUser");
const PropTypes = require("prop-types");
const React = require("react");
const useEffect = require("react").useEffect;
const useNavigate = require("react-router-dom").useNavigate;
const useState = require("react").useState;

const ArrowBackIcon = require("@mui/icons-material/ArrowBack").default;
const ArrowBackIconComponent = <ArrowBackIcon className="icon" />;

const Setup = ({ backendURL, validatePassword }
     :
     {
          backendURL: string,
          validatePassword: (arg0: string) => boolean
     }) => {
          const navigate = useNavigate();

          const [newBackendURL, setNewBackendURL] = useState("");
          const [confirmPassword, setConfirmPassword] = useState("");
          const [password, setPassword] = useState("");
          const [realname, setRealname] = useState("");
          const [username, setUsername] = useState("");

          const goBackClickHandler = () => {
               navigate("/Login");
          }

          const setupClickHandler = () => {
               if (typeof newBackendURL !== "string" || (typeof newBackendURL === "string" && (newBackendURL === null || newBackendURL === ""))) {
                    alert("Please enter the Backend URL");
                    return;
               }

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

               const validationResult = validatePassword(password);

               if (!validationResult) {
                    alert("The password must be at least 8 characters long, contain 2 lower case letters, 1 uppercase letter, 2 numbers and 2 symbols");
                    return;
               }

               axios.put(`${newBackendURL}/Setup?wl_username=${username}&wl_realname=${realname}&wl_password=${password}&wl_isadmin=true`, null)
               .then((res: typeof IUser) => {
                    if (res.data[0] === "OK") {
                         alert("User account was successfully created");

                         navigate("/Login");
                    } else {
                         alert("User account was NOT created. " + res.data[1]);
                    }
               })
              .catch((err: Error) => {});
          };

          useEffect(() => {
               const targetURL = typeof backendURL !== "undefined" ? typeof backendURL !== "undefined" : typeof newBackendURL !== "undefined" ? newBackendURL : "";

               if (typeof targetURL !== "undefined" && targetURL != "" && (targetURL.toString().startsWith("http://") || targetURL.toString().startsWith("https://"))) {
                    if (targetURL !== newBackendURL) {
                         setNewBackendURL(targetURL);
                    }
               }
          }, [backendURL, newBackendURL]);

          return (
               <>
                    <div className="login-page">
                         <span className="arrowIcon clickable topMargin" onClick={() => goBackClickHandler()}>
                              {ArrowBackIconComponent}
                         </span>

                         <div className="form">
                              <form className="login-form">
                                   <span className="login-label">WatchList Setup</span>

                                   <input className="topMargin" type="text" autoFocus value={newBackendURL} placeholder="Backend URL" required onChange={(event) => setNewBackendURL(event.target.value)} />

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
          );
};

Setup.propTypes = exact({
     backendURL: PropTypes.string,
     validatePassword: PropTypes.func.isRequired,
});

export default Setup;