import SearchIMDB from "../SearchIMDB";
import Login from "../Login";
import WatchList from "../WatchList";
import WatchListItem from "../WatchListItems";
import WatchListStats from "../WatchListStats";
import AdminConsole from "../AdminConsole";
import Setup from "../Setup";
const MuiIcon = require("@mui/icons-material").MuiIcon;

export default interface IRoute {
     key: {
          Name: string,
          DisplayName: string,
          Path: string,
          Icon: typeof MuiIcon,
          RequiresAuth: boolean,
          Component: typeof WatchList | typeof WatchListItem | typeof SearchIMDB | typeof WatchListStats | typeof AdminConsole | typeof Login | typeof Setup
     }
}