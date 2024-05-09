const MuiIcon = require("@mui/icons-material").MuiIcon;

export default interface IRoute {
     key: {
          Name: string,
          DisplayName: string,
          Path: string,
          Icon: typeof MuiIcon,
          RequiresAuth: boolean
     }
}