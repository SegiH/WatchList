"use client"

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../data-context";
import ManageUserAccounts from "./ManageUserAccounts";
import ManageWatchListSources from "./ManageWatchListSources";
import ManageWatchListTypes from "./ManageWatchListTypes";

import "../page.css";
import { AdminContextType } from "../interfaces/contexts/AdminContextType";

export default function Admin() {
     const {
          darkMode, defaultRoute, demoMode, isAdding, isAdmin, isEditing
     } = useContext(AdminContext) as AdminContextType

     const [isMounted, setIsMounted] = useState(false);
     const [selectedTab, setSelectedTab] = useState<number>(0);

     const router = useRouter();

     const tabClickHandler = (_event: React.SyntheticEvent, newValue: number) => {
          if (!isAdding && !isEditing) {
               setSelectedTab(newValue);

               localStorage.setItem("WatchList.AdminTab", newValue.toString());
          } else {
               if (isAdding) {
                    alert("You cannot switch tabs while adding an item");
               }

               if (isEditing) {
                    alert("You cannot switch tabs while editing an item");
               }
          }
     };

     const tabProps = (index: number) => {
          return {
               id: `simple-tab-${index}`,
               "aria-controls": `simple-tabpanel-${index}`,
          };
     };

     useEffect(() => {
          // Make sure current user is an admin
          if (!isAdmin() && !demoMode) {
               router.push(defaultRoute)
          }

          const newSelectedTab = localStorage.getItem("WatchList.AdminTab");

          if (newSelectedTab !== null) {
               setSelectedTab(parseInt(newSelectedTab, 10));
          }

          setIsMounted(true);
     }, [isAdmin, demoMode, router, defaultRoute]);

     return (
          <>
               {isMounted &&
                    <div className={`topMarginContent ${!darkMode ? " lightMode" : " darkMode"}`}>
                         <Tabs value={selectedTab} onChange={tabClickHandler}>
                              <Tab className={`${!darkMode ? "lightMode" : "darkMode"}`} label="Users" {...tabProps(0)} />
                              <Tab className={`${!darkMode ? "lightMode" : "darkMode"}`} label="Sources" {...tabProps(1)} />
                              <Tab className={`${!darkMode ? "lightMode" : "darkMode"}`} label="Types" {...tabProps(2)} />
                         </Tabs>



                         {selectedTab === 0 &&
                              <ManageUserAccounts />
                         }

                         {selectedTab === 1 &&
                              <ManageWatchListSources />
                         }

                         {selectedTab === 2 &&
                              <ManageWatchListTypes />
                         }
                    </div>
               }
          </>
     )
}