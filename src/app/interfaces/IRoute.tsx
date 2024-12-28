import { ComponentType } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface Route {
     Name: string;
     DisplayName: string;
     Path: string;
     Icon: React.JSX.Element | null;
     RequiresAuth: boolean;
   }
   
   // Define the structure of the routeList
export default interface IRouteList {
     WatchList: Route;
     Items: Route;
     WatchListStats: Route;
     Admin: Route;
     Login: Route;
     BugLog: Route;
}
   
