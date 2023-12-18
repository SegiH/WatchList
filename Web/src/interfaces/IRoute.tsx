import IMDBSearch from "../components/IMDBSearch";
import Login from "../components/Login";
import WatchList from "../components/WatchList";
import WatchListItem from "../components/WatchListItems";
import WatchListStats from "../components/WatchListStats";
import AdminConsole from "../components/admin/AdminConsole";
import Setup from "../components/Setup";

//import MuiIcon from "@mui/icons-material";
//const IMDBSearch = require("../components/IMDBSearch").default;
//const Login = require("../components/Login").default;
//const MuiIcon = require("@mui/icons-material").MuiIcon;
//const WatchList = require("../components/WatchList").WatchList;
//const WatchListItem = require("../components/WatchListItems").WatchListItem;
//const WatchListStats = require("../components/WatchListStats").default;
//const AdminConsole = require("../components/admin/AdminConsole").default;
//const Setup = require("../components/Setup").default;

interface IRoute {
    key: {
         Name: string,
         DisplayName: string,
         Path: string,
         Icon: any, //typeof MuiIcon,
         RequiresAuth: boolean,
         Component: typeof WatchList | typeof WatchListItem | typeof IMDBSearch | typeof WatchListStats | typeof AdminConsole | typeof Login | typeof Setup
    }
}