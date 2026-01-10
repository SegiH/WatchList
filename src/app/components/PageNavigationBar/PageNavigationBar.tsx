import { useContext, useEffect, useState } from "react";

import { PageNavigationBarContext } from "../../context";

import "./PageNavigationBar.css";
import { PageNavigationBarContextType } from "../../contexts/PageNavigationBarContextType";

interface PageNavigationBarProps {
    isBottomNav?: boolean;
    topRef?: any | null;
}

const PageNavigationBar = ({ isBottomNav, topRef }: PageNavigationBarProps) => {
    const {
        activeRoute, currentItemsPage, currentWatchListPage, darkMode, isAdding, isLoading, hideTabs, lastPage, setNewPage
    } = useContext(PageNavigationBarContext) as PageNavigationBarContextType;

    const [currentPage, setCurrentPage] = useState(-1);

    const pageClickHandler = (adjustValue: number) => {
        if (typeof topRef !== "undefined" && topRef !== null && topRef.current !== null && topRef.current.scrollIntoView !== null) {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        setNewPage(adjustValue);
    }

    useEffect(() => {
        switch (activeRoute) {
            case "WatchList":
                setCurrentPage(currentWatchListPage);
                break;
            case "Items":
                setCurrentPage(currentItemsPage);
        }
    }, [activeRoute]);

    return (
        <>
            {!isLoading && (activeRoute === "WatchList" || activeRoute === "Items") && !isAdding && (currentPage !== 1 || (currentPage === 1 && !lastPage)) &&
                <div className={`pageNavigationBar ${!darkMode ? "lightMode" : "darkMode"} ${hideTabs ? "noTabs" : ""}${isBottomNav ? " bottom" : ""}`}>
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

export default PageNavigationBar;