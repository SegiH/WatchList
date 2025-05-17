"use client"

import { useRouter } from 'next/navigation';
import { useContext } from "react";

import { APIStatus, DataContext, DataContextType } from "../data-context";

import "./Tabs.css";

const Tabs = () => {
     const {
          activeRoute,
          darkMode,
          demoMode,
          getPath,
          hideTabs,
          isAdding,
          isAdmin,
          isClient,
          isEditing,
          isEnabled,
          isError,
          isLoading,
          loggedInCheck,
          pullToRefreshEnabled,
          routeList,
          setActiveRoute,
          setCurrentPage,
          setSearchInputVisible,
          setSearchTerm,
          visibleSections
     } = useContext(DataContext) as DataContextType;

     const router = useRouter();

     const tabClickHandler = (tabClicked: string) => {
          setActiveRoute(tabClicked);

          if (tabClicked === "WatchList" || tabClicked === "Items") {
               setCurrentPage(1);
               setSearchInputVisible(false);
               setSearchTerm("");
          }

          const path = getPath(tabClicked.replace("/", ""));

          if (tabClicked === "Admin") {
               pullToRefreshEnabled(false);
          } else {
               pullToRefreshEnabled(true);
          }

          router.push(path);
     };

     return (
          <>
               {isClient && loggedInCheck === APIStatus.Success && !isError && !hideTabs && !isLoading && !isAdding && !isEditing && (
                    <div className={`tabBar ${!darkMode ? "lightMode" : "darkMode"}`}>
                         {Object.keys(routeList)
                              .filter((routeName) => {
                                   return routeList[routeName].RequiresAuth === true
                                        && routeName !== "Setup"
                                        && routeName !== "Search"
                                        && (routeName !== "Admin" || (routeName === "Admin" && ((isAdmin() === true && visibleSections.filter((section) => { return section.label === "Admin" }).length > 0) || demoMode))) // You cannot dynamically set Enabled on this route so don't call isEnabled()
                                        && (routeName !== "Items" || (routeName === "Items" && isEnabled("Items")))
                                        && (routeName !== "BugLogs" || (routeName === "BugLogs" && !demoMode && isAdmin() === true && visibleSections.filter(section => { return section.label === "BugLogs" }).length === 1))  // You cannot dynamically set Enabled on this route so don't call isEnabled()
                                        && (routeName !== "Stats" || (routeName === "Stats" && isEnabled("Stats")))
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