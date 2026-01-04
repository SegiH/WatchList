interface Route {
     Name: string;
     DisplayName: string;
     Path: string;
     Icon: React.JSX.Element | null;
     RequiresAuth: boolean;
     Enabled: boolean;
}
   
// Define the structure of the routeList
export default interface IRouteList {
     WatchList: Route;
     Items: Route;
     Stats: Route;
     Admin: Route;
     Login: Route;
     BugLogs: Route;
     Data: Route;
     Setup?: Route;
     "404"?: Route;
}

export type RouteKey = keyof IRouteList;