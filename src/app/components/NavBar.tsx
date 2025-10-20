import { useContext } from "react";

import { NavBarContext, NavBarContextType } from "../data-context";

import "./NavBar.css";

const NavBar = () => {
    const {
        activeRoute, currentPage, darkMode, isAdding, isLoading, hideTabs, lastPage, setCurrentPage, watchListSortDirection
    } = useContext(NavBarContext) as NavBarContextType;

    const pageClickHandler = (adjustValue: number) => {
        setCurrentPage(currentPage + (watchListSortDirection === "ASC" ? adjustValue * -1 : adjustValue));
    }

    return (
        <>
            {!isLoading && (activeRoute === "WatchList" || activeRoute === "Items") && !isAdding && (currentPage !== 1 || (currentPage === 1 && !lastPage)) &&
                <div className={`navBar ${!darkMode ? "lightMode" : "darkMode"} ${hideTabs ? "noTabs" : ""}`}>
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