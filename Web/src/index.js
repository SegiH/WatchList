//const App = require("./App").default;
import App from "./App"; // Do not use const App = require("./App").default if you want to use Electron!!!
const React = require("react");
const ReactDOM = require("react-dom/client");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
