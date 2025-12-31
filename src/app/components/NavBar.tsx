import { act, useContext } from "react";

import { NavBarContext } from "../context";

import "./NavBar.css";
import { NavBarContextType } from "../contexts/NavBarContextType";

const NavBar = (props) => {
    const {
        activeRoute, currentItemsPage, currentWatchListPage, darkMode, isAdding, isLoading, hideTabs, lastPage, setNewPage
    } = useContext(NavBarContext) as NavBarContextType;

    const pageClickHandler = (adjustValue: number) => {
        setNewPage(adjustValue);
    }

    const currentPage = activeRoute === "WatchList" ? currentWatchListPage : currentItemsPage;

    return (
        <>
            {!isLoading && (activeRoute === "WatchList" || activeRoute === "Items") && !isAdding && (currentPage !== 1 || (currentPage === 1 && !lastPage)) &&
                <div className={`navBar ${!darkMode ? "lightMode" : "darkMode"} ${hideTabs ? "noTabs" : ""}${props.IsBottomNav ? " bottom" : ""}`}>
                    {currentPage > 1 &&
                        <div className={`arrow left`} onClick={() => pageClickHandler(-1)}>&#8592;</div>
                    }

                    {!lastPage &&
                        <div className={`arrow right`} onClick={() => pageClickHandler(1)}>&#8594;</div>
                    }
                </div>
            }
        </>
    )
}

export default NavBar;