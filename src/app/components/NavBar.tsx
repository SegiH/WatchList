import { useContext } from "react";

import { DataContext, DataContextType } from "../data-context";

import "./NavBar.css";

const NavBar = () => {
    const {
        activeRoute,
        currentPage,
        darkMode,
        isAdding,
        isLoading,
        hideTabs,
        lastPage,
        setCurrentPage
    } = useContext(DataContext) as DataContextType;

    const pageClickHandler = (adjustValue: number) => {
        setCurrentPage(currentPage + adjustValue);
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