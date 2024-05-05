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
          const newRoute = !isLoggedInCheckComplete || (isLoggedInCheckComplete && !isLoggedIn)
               ? "Login"
               : activeRoute !== "" && (activeRoute !== "Setup" || (activeRoute === "Setup" && !isLoggedIn))
                    ? activeRoute
                    : location.pathname !== "" && Object.keys(routeList).filter((routeName) => routeList[routeName].Path === location.pathname).length === 1
                         ? location.pathname
                         : defaultRoute;

          const newRouteCleaned = newRoute.replace("/", "").replace("\\", "");

          setActiveRoute(newRouteCleaned);

          const path = getPath(newRouteCleaned);

          router.push(path);

          const displayName = getDisplayName(newRoute);

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     }, [activeRoute, defaultRoute, getDisplayName, isLoggedIn, isLoggedInCheckComplete, routeList, setActiveRoute, setActiveRouteDisplayName]);

     return (
          <>
               {isLoggedInCheckComplete && isLoggedIn && (
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