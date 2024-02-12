const exact = require("prop-types-exact");
const IRoute = require("./interfaces/IRoute");
const PropTypes = require("prop-types");
const React = require("react");
const Tabs = require("./Tabs").default;

const TabParent = ({ activeRoute, admin, defaultRoute,isLoggedIn, isLoggedInCheckComplete, routeList, setActiveRoute, setActiveRouteDisplayName }
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
     return (
          <Tabs activeRoute={activeRoute} admin={admin} defaultRoute={defaultRoute} isLoggedIn={isLoggedIn} isLoggedInCheckComplete={isLoggedInCheckComplete} routeList={routeList} setActiveRoute={setActiveRoute} setActiveRouteDisplayName={setActiveRouteDisplayName} />
     );
};

TabParent.propTypes = exact({
     activeRoute: PropTypes.string.isRequired,
     admin: PropTypes.bool,
     defaultRoute: PropTypes.string.isRequired,
     isLoggedIn: PropTypes.bool.isRequired,
     isLoggedInCheckComplete: PropTypes.bool.isRequired,
     routeList: PropTypes.object.isRequired,
     setActiveRoute: PropTypes.func.isRequired,
     setActiveRouteDisplayName: PropTypes.func.isRequired,
});

export default TabParent;
