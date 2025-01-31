"use client"

import React, { useContext } from "react";
import { useRouter } from 'next/navigation';

import { DataContext, DataContextType } from "../data-context";

import "./Tabs.css";

const Tabs = () => {
     const {
          activeRoute,
          darkMode,
          demoMode,
          getDisplayName,
          getPath,
          hideTabs,
          isAdmin,
          isClient,
          isEnabled,
          isError,
          isLoggedIn,
          isLoggedInCheckComplete,
          pullToRefreshEnabled,
          routeList,
          setActiveRoute,
          setActiveRouteDisplayName,
     } = useContext(DataContext) as DataContextType

     const router = useRouter();

     const tabClickHandler = (tabClicked: string) => {
          setActiveRoute(tabClicked);

          const path = getPath(tabClicked.replace("/", ""));

          if (tabClicked === "Admin") {
               pullToRefreshEnabled(false);
          } else {
               pullToRefreshEnabled(true);
          }

          router.push(path);

          const displayName = getDisplayName(tabClicked.replace("/", ""));

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     };

     return (
          <>
               {isClient && isLoggedInCheckComplete && isLoggedIn && !isError && !hideTabs && (
                    <div className={`tabBar ${!darkMode ? "lightMode" : "darkMode"}`}>
                         {Object.keys(routeList)
                              .filter((routeName) => {
                                   return routeList[routeName].RequiresAuth === true
                                   && routeName !== "Setup"
                                   && routeName !== "SearchIMDB"
                                   && (routeName !== "Admin" || (routeName === "Admin" && isAdmin() === true && isEnabled("Admin")))
                                   && (routeName !== "Items" || (routeName ==="Items" && isEnabled("Items")))
                                   && (routeName !== "BugLogs" || (routeName ==="BugLogs" && isEnabled("BugLogs") && !demoMode))
                                   && (routeName !== "WatchListStats" || (routeName === "WatchListStats" && isEnabled("Stats")))
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