"use client"

import { useRouter } from 'next/navigation';
import { useContext } from "react";

import { APIStatus, TabsContext } from "../../context";

import "./Tabs.css";
import { TabsContextType } from '../../contexts/TabsContextType';

const Tabs = () => {
     const {
          activeRoute, darkMode, demoMode, getPath, hideTabs, isAdding, isAdmin, isClient, isEditing, isEnabled, isError, isLoading, loggedInCheck, pullToRefreshEnabled, routes, setActiveRoute, setSearchTerm, visibleSections
     } = useContext(TabsContext) as TabsContextType;

     const router = useRouter();

     const tabClickHandler = (tabClicked: string) => {
          setActiveRoute(tabClicked);

          if (tabClicked === "WatchList" || tabClicked === "Items") {
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
               {isClient && loggedInCheck === APIStatus.Success && !isError && !hideTabs && !isLoading && !isAdding && !isEditing && activeRoute !== "" && (
                    <div className={`tabBar ${!darkMode ? "lightMode" : "darkMode"}`}>
                         {typeof routes !== "undefined" && routes !== null && Object.keys(routes).length > 0 && Object.keys(routes)
                              .filter((routeName) => {
                                   return routes[routeName].RequiresAuth === true
                                        && routeName !== "Setup"
                                        && routeName !== "Search"
                                        && (routeName !== "Data" || (routeName === "Data" && isAdmin() === true && visibleSections.filter((section) => { return section.label === "Data" }).length > 0))
                                        && (routeName !== "Admin" || (routeName === "Admin" && ((isAdmin() === true && visibleSections.filter((section) => { return section.label === "Admin" }).length > 0)))) // You cannot dynamically set Enabled on this route so don't call isEnabled()
                                        && (routeName !== "Items" || (routeName === "Items" && isEnabled("/Items")))
                                        && (routeName !== "BugLogs" || (routeName === "BugLogs" && !demoMode && isAdmin() === true && visibleSections.filter(section => { return section.label === "BugLogs" }).length === 1))  // You cannot dynamically set Enabled on this route so don't call isEnabled()
                                        && (routeName !== "Stats" || (routeName === "Stats" && isEnabled("/Stats"))
                                        )
                              }
                              )
                              .map((routeName, index) => {
                                   return (
                                        <span key={index} className={`tab ${String(activeRoute) === String(routes[routeName].Name) ? "active" : ""} ${!darkMode ? "lightMode" : "darkMode"}`}>
                                             <span className={`tabitem ${(!darkMode || (darkMode && darkMode && activeRoute === routes[routeName].Name)) ? " lightMode" : " darkMode"}`}>
                                                  <span className={`clickable tabIcon`} onClick={() => tabClickHandler(routes[routeName].Name)}>
                                                       {routes[routeName].Icon}
                                                  </span>

                                                  <span className="tabLabel">{typeof routes[routeName].DisplayName !== "undefined" ? routes[routeName].DisplayName : routes[routeName].Name}</span>
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