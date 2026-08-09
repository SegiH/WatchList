import { useContext, useEffect, useState } from "react";

import { PageNavigationBarContext } from "../context";

import { PageNavigationBarContextType } from "../contexts/PageNavigationBarContextType";
import Button from "@mui/material/Button";

interface PageNavigationBarProps {
    isBottomNav?: boolean;
    topRef?: any | null;
}

const PageNavigationBar = ({ isBottomNav, topRef }: PageNavigationBarProps) => {
    const {
        activeRoute, currentItemsPage, currentWatchListPage, IMDBSearchClickHandler, imdbSearchEnabled, isAdding, isLoading, hideTabs, lastPage, searchTerm, setNewPage, setSearchTerm
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
    }, [activeRoute, currentWatchListPage, currentItemsPage]);

    return (
        <>
            {!isLoading && (activeRoute === "WatchList" || activeRoute === "Items") && !isAdding && (currentPage !== 1 || (currentPage === 1 && !lastPage)) &&
                <div className={`pageNavigationBar ${hideTabs ? "pageNavigationBarNoTabs" : ""}${isBottomNav ? " bottom" : ""}`}>
                    {currentPage > 1 &&
                        <div className={`pageNavigationBarLeft leftMargin50`} onClick={() => pageClickHandler(-1)}>&#8592;</div>
                    }

                    <span className={`activeRoute leftMargin125 ${activeRoute === "WatchList" || activeRoute === "Items" ? "activeRouteHidden" : ""}`}>{activeRoute}</span>

                    {!lastPage &&
                        <>
                            <span className={`searchInputStyle searchInputStyleBottom`}>
                                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                            </span>

                            {!isLoading && searchTerm !== "" && imdbSearchEnabled &&
                                <Button className="IMDBSearchButton IMDBSearchButtonButtom" variant="contained" color="secondary" onClick={() => IMDBSearchClickHandler()}>IMDB</Button>
                            }

                            <div className={`pageNavigationBarRight`} onClick={() => pageClickHandler(1)}>&#8594;</div>
                        </>
                    }
                </div>
            }
        </>
    )
}

export default PageNavigationBar;