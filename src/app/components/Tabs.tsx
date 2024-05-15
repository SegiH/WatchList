"use client"

const React = require("react");
const useCallback = require("react").useCallback;
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
import { DataContext, DataContextType } from "../data-context";

import "./Tabs.css";

const Tabs = () => {
     const {
          activeRoute,
          admin,
          defaultRoute,
          isClient,
          isError,
          isLoggedIn,
          isLoggedInCheckComplete,
          routeList,
          setActiveRoute,
          setActiveRouteDisplayName
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     const getDisplayName = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].DisplayName;
          } else {
               return "";
          }
     }, [routeList]);

     const getPath = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].Path;
          } else {
               return "";
          }
     }, [routeList]);

     const tabClickHandler = (tabClicked: string) => {
          setActiveRoute(tabClicked);

          const path = getPath(tabClicked.replace("/", ""));

          router.push(path);

          const displayName = getDisplayName(tabClicked.replace("/", ""));

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     };

     useEffect(() => {
          if (!isClient) {
               return;
          }

          if (!isLoggedInCheckComplete) { // Tabs should never be rendered if the logged in check is not complete
               return;
          }

          if (!isLoggedIn) { // Tabs should never be rendered if the user is not logged in
               return;
          }

          const newRoute = location.pathname !== "" && Object.keys(routeList).filter((routeName) => routeList[routeName].Path === location.pathname).length === 1
                         ? location.pathname
                         : activeRoute !== "" && (activeRoute !== "Setup" || (activeRoute === "Setup" && !isLoggedIn))
                         ? activeRoute
                         : defaultRoute;

          const newRouteCleaned = newRoute.replace("/", "").replace("\\", "");

          setActiveRoute(newRouteCleaned);

          const path = getPath(newRouteCleaned);

          router.push(path);

          const displayName = getDisplayName(newRoute);

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     }, [defaultRoute, isLoggedIn, isLoggedInCheckComplete]); // Do not add activeRoute, getDisplayName, routeList, setActiveRoute, setActiveRouteDisplayName to dependencies. Causes dtl to close when you click on edit

     return (
          <>
               {isClient && isLoggedInCheckComplete && isLoggedIn && !isError && (
                    <div className="tabBar">
                         {Object.keys(routeList)
                              .filter((routeName) => routeList[routeName].RequiresAuth === true && routeName !== "Setup" && routeName !== "SearchIMDB" && (routeName !== "AdminConsole" || (routeName === "AdminConsole" && admin === true)))
                              .map((routeName, index) => {
                                   return (
                                        <span key={index} className="tab">
                                             <span className={`tabitem ${activeRoute === routeList[routeName].Name ? "active" : ""}`}>
                                                  <span className={`clickable tabIcon`} onClick={() => tabClickHandler(routeList[routeName].Name)}>
                                                       {routeList[routeName].Icon}
                                                  </span>

                                                  <span className="tabLabel">{typeof routeList[routeName].DisplayName !== "undefined" ? routeList[routeName].DisplayName : routeList[routeName].Name}</span>
                                             </span>
                                        </span>
                                   );
                              })
                         }
                    </div>
               )}
          </>
     );
};

export default Tabs;