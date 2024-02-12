const exact = require("prop-types-exact");
const IRoute = require("./interfaces/IRoute");
const PropTypes = require("prop-types");
const React = require("react");
const useEffect = require("react").useEffect;

import { useCallback } from "react";
import "./Tabs.css";

const Tabs = ({ activeRoute, admin, defaultRoute, isLoggedIn, isLoggedInCheckComplete, routeList, setActiveRoute, setActiveRouteDisplayName }
     :
     {
          activeRoute: string,
          admin: boolean,
          defaultRoute: string,
          isLoggedIn: boolean,
          isLoggedInCheckComplete: boolean,
          routeList: typeof IRoute,
          setActiveRoute: (arg0: string) => void,
          setActiveRouteDisplayName: (arg0: string) => void
     }) => {
     const getDisplayName = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].DisplayName;
          } else {
               return "";
          }
     }, [routeList]);

     const tabClickHandler = (tabClicked: string) => {
          setActiveRoute(tabClicked);

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

          const displayName = getDisplayName(newRoute);

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     }, [activeRoute, defaultRoute, getDisplayName, isLoggedIn, isLoggedInCheckComplete, routeList, setActiveRoute, setActiveRouteDisplayName]);

     return (
          <>
               {activeRoute !== "" && routeList && routeList[activeRoute] && isLoggedInCheckComplete && isLoggedIn &&
                    <>
                         {routeList[activeRoute].Component}
                    </>
               }

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

Tabs.propTypes = exact({
     activeRoute: PropTypes.string.isRequired,
     admin: PropTypes.bool,
     defaultRoute: PropTypes.string.isRequired,
     isLoggedIn: PropTypes.bool.isRequired,
     isLoggedInCheckComplete: PropTypes.bool.isRequired,
     routeList: PropTypes.object.isRequired,
     setActiveRoute: PropTypes.func.isRequired,
     setActiveRouteDisplayName: PropTypes.func.isRequired,
});

export default Tabs;