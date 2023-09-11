const exact = require ("prop-types-exact");
const IRoute = require ("../../interfaces/IRoute");
const PropTypes = require("prop-types");
const React = require("react");
const Route = require("react-router-dom").Route;
const Routes = require("react-router-dom").Routes;
const useEffect = require("react").useEffect;
const useLocation = require("react-router-dom").useLocation;
const useNavigate = require("react-router-dom").useNavigate;

import "./Tabs.css";

const Tabs = ({ activeRoute, admin, defaultRoute, isIMDBSearchEnabled, isLoggedIn, isLoggedInCheckComplete, routeList, setActiveRoute, setActiveRouteDisplayName }
  :
  { activeRoute: string, admin: boolean, defaultRoute: string, isIMDBSearchEnabled: boolean, isLoggedIn: boolean, isLoggedInCheckComplete: boolean, routeList: typeof IRoute, setActiveRoute: (arg0: string) => void, setActiveRouteDisplayName: (arg0: string) => void }
  ) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getDisplayName = (routeName: string) => {
    const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

    if (matchingRoute.length === 1) {
      return routeList[matchingRoute[0]].DisplayName;
    } else {
      return "";
    }
  };

  const tabClickHandler = (tabClicked: string) => {
    setActiveRoute(tabClicked);
    
    const displayName=getDisplayName(tabClicked.replace("/",""));

    if (displayName !== "") {
         setActiveRouteDisplayName(displayName);
    }

    navigate(tabClicked);
  };

  useEffect(() => {
    const newRoute = !isLoggedInCheckComplete
                     || (isLoggedInCheckComplete && !isLoggedIn) 
                     ? "Login" 
                     : activeRoute !== "" && (activeRoute !== "Setup" || (activeRoute === "Setup" && !isLoggedIn)) 
                            ? activeRoute 
                            : location.pathname !== "" && Object.keys(routeList).filter((routeName) => routeList[routeName].Path === location.pathname).length === 1
                              ? location.pathname
                              : defaultRoute
                     ;

    const newRouteCleaned = newRoute.replace("/","").replace("\\","");

    setActiveRoute(newRouteCleaned);

    const displayName=getDisplayName(newRoute);

    if (displayName !== "") {
         setActiveRouteDisplayName(displayName);
    }

    navigate(newRoute); 
  }, [activeRoute]);

  useEffect(() => {
    const isValidPath = Object.keys(routeList).filter((routeName) => routeList[routeName].Path === location.pathname);

    if (isValidPath.length === 0) {
      // Any invalid path will redirect to /Login if not logged in or /WatchList if logged in already
      if (!isLoggedIn) {
        setActiveRoute("Login");
        navigate("/Login");
      } else {
        setActiveRoute(defaultRoute);
        navigate("/" + defaultRoute);
      }
    } else if ((location.pathname === "/Login" || location.pathname === "/Setup") && isLoggedIn) {
      // Do not allow access to these paths when logged in
      setActiveRoute(defaultRoute);
      navigate("/" + defaultRoute);
    } else if (location.pathname === "AdminConsole" && admin !== true) {
      // Do not allow access to this paths if not an admin
      setActiveRoute(defaultRoute);
      navigate("/" + defaultRoute);
    } else if (routeList[isValidPath[0]].RequiresAuth === true && !isLoggedIn) {
      // Do not allow access to these paths when not logged in
      setActiveRoute("Login");
      navigate("/Login");
    }
  }, [location]);

  return (
    <>
      <Routes>
        {Object.keys(routeList)
          .filter((routeName) => {
            return (routeName !== "IMDBSearch" || (routeName === "IMDBSearch" && isIMDBSearchEnabled)) && (routeName !== "AdminConsole" || (routeName === "AdminConsole" && admin === true)) && (routeName !== "Login" || (routeName === "Login" && isLoggedInCheckComplete && !isLoggedIn)) && (routeName !== "Setup" || (routeName === "Setup" && !isLoggedIn));
          })
          .map((routeName, index) => {
            return <Route key={index} path={routeList[routeName].Path} element={routeList[routeName].Component} />;
          })}       
      </Routes>

      {isLoggedInCheckComplete && isLoggedIn && (
        <div className="tabBar">
          {Object.keys(routeList)
            .filter((routeName) => routeList[routeName].RequiresAuth === true && routeName !== "Setup" && (routeName !== "IMDBSearch" || (routeName === "IMDBSearch" && isIMDBSearchEnabled)) && (routeName !== "AdminConsole" || (routeName === "AdminConsole" && admin === true)))
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
            })}
        </div>
      )}
    </>
  );
};

Tabs.propTypes = exact({
  activeRoute: PropTypes.string.isRequired,
  admin: PropTypes.bool,
  defaultRoute: PropTypes.string.isRequired,
  isIMDBSearchEnabled: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isLoggedInCheckComplete: PropTypes.bool.isRequired,
  routeList: PropTypes.object.isRequired,
  setActiveRoute: PropTypes.func.isRequired,
  setActiveRouteDisplayName: PropTypes.func.isRequired,
});

export default Tabs;

       {/*<Route path="*" element={<Navigate to={"/Watchlist"} replace />} />*/}

        {/*{isLoggedIn &&
               <Route path="*" element={<Navigate to="/WatchList" replace />} />
          }*/}

        {/*{!isLoggedIn &&
               <Route path="*" element={<Navigate to="/Login" replace />} />
          }*/}