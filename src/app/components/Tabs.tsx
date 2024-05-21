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
                    <div className="tabBar">
                         {Object.keys(routeList)
                              .filter((routeName) => {
                                   return routeList[routeName].RequiresAuth === true
                                   && routeName !== "Setup"
                                   && routeName !== "SearchIMDB"
                                   && (routeName !== "AdminConsole" || (routeName === "AdminConsole" && admin === true))
                                   && (routeName !== "WatchListItems" || (routeName ==="WatchListItems" && showWatchListItems === true))
                              }
                              )
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