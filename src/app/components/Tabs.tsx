"use client"

const React = require("react");
const useContext = require("react").useContext;
const useRouter = require("next/navigation").useRouter;
import { DataContext, DataContextType } from "../data-context";

import "./Tabs.css";

const Tabs = () => {
     const {
          activeRoute,
          admin,
          bugLogVisible,
          darkMode,
          demoMode,
          getDisplayName,
          getPath,
          isClient,
          isError,
          isLoggedIn,
          isLoggedInCheckComplete,
          routeList,
          setActiveRoute,
          setActiveRouteDisplayName,
          showWatchListItems
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     const tabClickHandler = (tabClicked: string) => {
          setActiveRoute(tabClicked);

          const path = getPath(tabClicked.replace("/", ""));

          router.push(path);

          const displayName = getDisplayName(tabClicked.replace("/", ""));

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     };

     return (
          <>
               {isClient && isLoggedInCheckComplete && isLoggedIn && !isError && (
                    <div className={`tabBar ${!darkMode ? "lightMode" : "darkMode"}`}>
                         {Object.keys(routeList)
                              .filter((routeName) => {
                                   return routeList[routeName].RequiresAuth === true
                                   && routeName !== "Setup"
                                   && routeName !== "SearchIMDB"
                                   && (routeName !== "AdminConsole" || (routeName === "AdminConsole" && admin === true))
                                   && (routeName !== "WatchListItems" || (routeName ==="WatchListItems" && showWatchListItems === true))
                                   && (routeName !== "BugLog" || (routeName ==="BugLog" && bugLogVisible === true && !demoMode))
                              }
                              )
                              .map((routeName, index) => {
                                   return (
                                        <span key={index} className={`tab ${activeRoute === routeList[routeName].Name ? "active" : ""} ${!darkMode ? "lightMode" : "darkMode"}`}>
                                             <span className={`tabitem ${(!darkMode || (darkMode && darkMode && activeRoute === routeList[routeName].Name)) ? " lightMode" : " darkMode"}`}>
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