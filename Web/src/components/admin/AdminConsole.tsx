const MuiIcon = require("@mui/icons-material").MuiIcon;
const exact = require ("prop-types-exact");
const IWatchListSource = require("../../interfaces/IWatchListSource");
const IWatchListType = require("../../interfaces/IWatchListType");
const ManageWatchListSources = require("./ManageWatchListSources").default;
const ManageWatchListTypes = require("./ManageWatchListTypes").default;
const ManageUserAccounts = require("./ManageUserAccounts").default;
const PropTypes = require("prop-types");
const React = require("react");
const Tab = require("@mui/material/Tab").default;
const Tabs = require("@mui/material/Tabs").default;
const useState = require("react").useState;

import "./AdminConsole.css";

const CustomTabPanel = require("./CustomTabPanel").default;

const AdminConsole = ({ backendURL, CancelIcon, EditIcon, generateRandomPassword, SaveIcon, setWatchListSources, setWatchListSourcesLoadingComplete, setWatchListSourcesLoadingStarted, setWatchListTypes, setWatchListTypesLoadingComplete, setWatchListTypesLoadingStarted, validatePassword, watchListSources, watchListTypes }
     :{
          backendURL: string,
          CancelIcon: typeof MuiIcon,
          EditIcon: typeof MuiIcon,
          generateRandomPassword: () => string,
          SaveIcon: typeof MuiIcon,
          setWatchListSources: (arg0: typeof IWatchListSource) => void,
          setWatchListSourcesLoadingComplete: (arg0: boolean) => void,
          setWatchListSourcesLoadingStarted: (arg0: boolean) => void,
          setWatchListTypes: (arg0: typeof IWatchListType) => void,
          setWatchListTypesLoadingComplete: (arg0: boolean) => void,
          setWatchListTypesLoadingStarted: (arg0: boolean) => void,
          validatePassword: (arg0: string) => boolean, watchListSources: typeof IWatchListSource,
          watchListTypes: typeof IWatchListType
     }) => {
          const [isAdding, setIsAdding] = useState(false);
          const [isEditing, setIsEditing] = useState(false);
          const [selectedTab, setSelectedTab] = useState(0);

          const tabClickHandler = (event: Event, newValue: string) => {
               if (!isAdding && !isEditing) {
                    setSelectedTab(newValue);
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

          return (
               <>
                    <Tabs value={selectedTab} onChange={tabClickHandler}>
                         <Tab label="Users" {...tabProps(0)} />
                         <Tab label="Sources" {...tabProps(1)} />
                        <Tab label="Types" {...tabProps(2)} />
                    </Tabs>

                    <CustomTabPanel value={selectedTab} index={0}>
                         <ManageUserAccounts backendURL={backendURL} CancelIcon={CancelIcon} EditIcon={EditIcon} generateRandomPassword={generateRandomPassword} SaveIcon={SaveIcon} setIsAdding={setIsAdding} setIsEditing={setIsEditing} validatePassword={validatePassword} />
                    </CustomTabPanel>

                    <CustomTabPanel value={selectedTab} index={1}>
                         <ManageWatchListSources backendURL={backendURL} CancelIcon={CancelIcon} EditIcon={EditIcon} SaveIcon={SaveIcon} setIsAdding={setIsAdding} setIsEditing={setIsEditing} setWatchListSources={setWatchListSources} setWatchListSourcesLoadingStarted={setWatchListSourcesLoadingStarted} setWatchListSourcesLoadingComplete={setWatchListSourcesLoadingComplete} watchListSources={watchListSources} />
                    </CustomTabPanel>
      
                    <CustomTabPanel value={selectedTab} index={2}>
                         <ManageWatchListTypes backendURL={backendURL} CancelIcon={CancelIcon} EditIcon={EditIcon} SaveIcon={SaveIcon} setIsAdding={setIsAdding} setIsEditing={setIsEditing} setWatchListTypes={setWatchListTypes} setWatchListTypesLoadingStarted={setWatchListTypesLoadingStarted} setWatchListTypesLoadingComplete={setWatchListTypesLoadingComplete} watchListTypes={watchListTypes} />
                    </CustomTabPanel>
               </>
          );
};

AdminConsole.propTypes = exact({
     backendURL: PropTypes.string.isRequired,
     CancelIcon: PropTypes.object.isRequired,
     EditIcon: PropTypes.object.isRequired,
     generateRandomPassword: PropTypes.func.isRequired,
     SaveIcon: PropTypes.object.isRequired,
     setWatchListSources: PropTypes.func.isRequired,
     setWatchListSourcesLoadingComplete: PropTypes.func.isRequired,
     setWatchListSourcesLoadingStarted: PropTypes.func.isRequired,
     setWatchListTypes: PropTypes.func.isRequired,
     setWatchListTypesLoadingComplete: PropTypes.func.isRequired,
     setWatchListTypesLoadingStarted: PropTypes.func.isRequired,
     validatePassword: PropTypes.func.isRequired,
     watchListSources: PropTypes.array.isRequired,
     watchListTypes: PropTypes.array.isRequired,
});

export default AdminConsole;