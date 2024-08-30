"use client"

const ManageWatchListSources = require("./ManageWatchListSources").default;
const ManageWatchListTypes = require("./ManageWatchListTypes").default;
const ManageUserAccounts = require("./ManageUserAccounts").default;
const React = require("react");
const Tab = require("@mui/material/Tab").default;
const Tabs = require("@mui/material/Tabs").default;
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

import "./AdminConsole.css";
import "../page.css";

const CustomTabPanel = require("./CustomTabPanel").default;

export default function Admin() {
     const {
          darkMode,
          defaultRoute,
          isAdding,
          isAdmin,
          isEditing
     } = useContext(DataContext) as DataContextType

     const [selectedTab, setSelectedTab] = useState(0);

     const router = useRouter();

     const tabClickHandler = (_event: Event, newValue: string) => {
          if (!isAdding && !isEditing) {
               setSelectedTab(newValue);

               localStorage.setItem("WatchList.AdminTab", newValue);
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
          if (!isAdmin()) {
               router.push(defaultRoute)
          }

          const newSelectedTab = localStorage.getItem("WatchList.AdminTab");

          if (newSelectedTab !== null) {
               setSelectedTab(parseInt(newSelectedTab));
          }

     }, []);

     return (
          <div>
               <Tabs value={selectedTab} onChange={tabClickHandler}>
                    <Tab className={`${!darkMode ? " blackForeground whiteBackground" : " whiteForeground blackBackground"}`} label="Users" {...tabProps(0)} />
                    <Tab className={`${!darkMode ? " blackForeground whiteBackground" : " whiteForeground blackBackground"}`} label="Sources" {...tabProps(1)} />
                    <Tab className={`${!darkMode ? " blackForeground whiteBackground" : " whiteForeground blackBackground"}`} label="Types" {...tabProps(2)} />
               </Tabs>

               <CustomTabPanel value={selectedTab} index={0}>
                    <ManageUserAccounts />
               </CustomTabPanel>

               <CustomTabPanel value={selectedTab} index={1}>
                    <ManageWatchListSources />
               </CustomTabPanel>

               <CustomTabPanel value={selectedTab} index={2}>
                    <ManageWatchListTypes />
               </CustomTabPanel>
          </div>
     )
}