import IMDBSearch from "../components/IMDBSearch";
import Login from "../components/Login";
import WatchList from "../components/WatchList";
import WatchListItem from "../components/WatchListItems";
import WatchListStats from "../components/WatchListStats";
import AdminConsole from "../components/admin/AdminConsole";
import Setup from "../components/Setup";
const MuiIcon = require("@mui/icons-material").MuiIcon;

export default interface IRoute {
     key: {
          Name: string,
          DisplayName: string,
          Path: string,
          Icon: typeof MuiIcon,
          RequiresAuth: boolean,
          Component: typeof WatchList | typeof WatchListItem | typeof IMDBSearch | typeof WatchListStats | typeof AdminConsole | typeof Login | typeof Setup
     }
}