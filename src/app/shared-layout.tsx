"use client"

const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

import SearchIMDB from "./components/SearchIMDB";
import Settings from "./components/Settings";
import { DataContext, DataContextType } from "./data-context";

const SharedLayout = () => {
     const {
          activeRouteDisplayName,
          isError,
          isLoggedIn,
          SearchIconComponent,
          searchVisible,
          SettingsIconComponent,
          settingsVisible,
          showSearch,
          showSettings,
          watchListSourcesLoadingComplete,
          watchListTypesLoadingComplete
     } = useContext(DataContext) as DataContextType

     const [isClient, setIsClient] = useState(false);

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);
     }, []);

     if (!isLoggedIn || !isClient) {
          return <></>
     }

     return (
          <>
               {!isError &&
                    <>
                         {isLoggedIn && watchListSourcesLoadingComplete && watchListTypesLoadingComplete &&
                              <>
                                   <span className="menuBar">
                                        <span className="leftMargin menuBarActiveRoute">{activeRouteDisplayName}</span>

                                        <span className="options">
                                             <span className="clickable searchIcon" style={{ color: "white" }} onClick={showSearch}>
                                                  {SearchIconComponent}
                                             </span>

                                             <span className="clickable" style={{ color: "white" }} onClick={showSettings}>
                                                  {SettingsIconComponent}
                                             </span>
                                        </span>
                                   </span>
                              </>
                         }

                         {searchVisible &&
                              <SearchIMDB />
                         }

                         {settingsVisible &&
                              <Settings />
                         }
                    </>
               }

               {isError &&
                    <div className="foregroundColor"><img src="/404.jpg" alt="Uh oh. Something went wrong" /></div>
               }
          </>
     )
}

export default SharedLayout;