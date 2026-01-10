import { Button } from "@mui/material";
import Select from 'react-select';
import { useEffect, useState } from "react";

import "../page.css";
import { APIStatus } from "../context";

interface MetaDataFilterProps {
    closeMetaDataFilters: () => void;
    darkMode: boolean;
    metaDataFilters: any[];
    setMetaDataFilters: (value: Record<string, any>) => void;
}

const MetaDataFilter = ({ closeMetaDataFilters, darkMode, metaDataFilters, setMetaDataFilters }: MetaDataFilterProps) => {
    const [metaDataLoadingCheck, setMetaDataLoadingCheck] = useState(APIStatus.Idle);
    const [metaDataObj, setMetaDataObj] = useState<any>([]);
    const [selectedValues, setSelectedValues] = useState<any>([]);

    const filterChangeHandler = (key: string, newList: []) => {
        const newMetaDataFilters = { ...selectedValues };

        // This key is added automatically for some reason so remove it.
        if (typeof newMetaDataFilters["0"] !== "undefined") {
            delete newMetaDataFilters["0"];
        }

        newMetaDataFilters[key] = newList;

        setSelectedValues(newMetaDataFilters);
    }

    const clearFiltersClickHandler = () => {
        setMetaDataFilters([{}]);
        closeMetaDataFilters();
    }

    const getMetaData = async () => {
        try {
            const getMetaDataResponse = await fetch(`/api/GetMetadata`, { credentials: 'include' });

            const getMetaDataResult = await getMetaDataResponse.json();

            if (getMetaDataResult[0] === "OK") {
                setMetaDataObj(getMetaDataResult[1])
            } else {
                alert(`An error occurred while getting the metadata`);
            }

            setSelectedValues(metaDataFilters);

            setMetaDataLoadingCheck(APIStatus.Success);
        } catch (e: any) {
            alert(e.message);
        }
    }

    const setFiltersClickHandler = () => {
        // Delete empty selected arrays
        const newSelectedValues = { ...selectedValues };

        Object.keys(newSelectedValues).forEach((selectedKey, index) => {
            if (selectedValues[selectedKey].length === 0) {
                delete selectedValues[selectedKey];
            }
        });

        if (Object.keys(newSelectedValues).length === 0) {
            setMetaDataFilters([{}]);
        } else {
            setMetaDataFilters(selectedValues);
        }

        closeMetaDataFilters();
    }

    useEffect(() => {
        if (metaDataLoadingCheck === APIStatus.Idle) {
            setMetaDataLoadingCheck(APIStatus.Loading);
        }
    }, []);

    useEffect(() => {
        if (metaDataLoadingCheck !== APIStatus.Loading) {
            return;
        }

        getMetaData();
    }, [metaDataLoadingCheck]);

    return (
        <>
            {metaDataLoadingCheck === APIStatus.Success &&
                <div className="modal scrollable">
                    <div className={`modal-content scrollable overflowY settingsPanel textLabel ${!darkMode ? " lightMode" : " darkMode"}`} style={{ overflowY: "auto" }}>
                        <div>Metadata Filter</div>

                        <div className="metaDataFilterButtons">
                            <Button variant="contained" color="error" onClick={() => clearFiltersClickHandler()}>Clear</Button>
                            <Button variant="contained" onClick={() => setFiltersClickHandler()}>Go</Button>
                        </div>

                        <br />

                        <div>
                            {Object.keys(metaDataObj).map((meta: any, index: number) => {
                                return (
                                    <div key={index}>
                                        {metaDataObj[meta]["Label"]}

                                        <Select
                                            isMulti
                                            value={selectedValues[meta]}
                                            onChange={(selectedOptions: any) => filterChangeHandler(meta, selectedOptions)}
                                            options={metaDataObj[meta]["Values"]}
                                            className="custom-select"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: 'white',  // Set background of the input field to white
                                                    borderColor: 'black',      // Set border color of the input field to black
                                                    color: 'black',            // Set text color of the input field to black
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: 'black',            // Set color of the selected value to black
                                                }),
                                                multiValue: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: 'white',  // Set background color of the multi-value to white
                                                    color: 'black',            // Set text color of the multi-value to black
                                                }),
                                                multiValueLabel: (provided) => ({
                                                    ...provided,
                                                    color: 'black',            // Set text color of the multi-value label to black
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: 'white',  // Set background color of the dropdown to white
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: 'white',  // Set option background color on hover and select
                                                    color: 'black',            // Set text color of options to black
                                                    ':hover': {
                                                        backgroundColor: 'lightgray',  // Set hover background to light gray
                                                    },
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    color: 'black',
                                                }),
                                            }}
                                        />

                                        <br />
                                    </div>
                                )
                            })}

                            <div className="metaDataFilterButtons">
                                <Button variant="contained" color="error" onClick={() => clearFiltersClickHandler()}>Clear</Button>
                                <Button variant="contained" onClick={() => setFiltersClickHandler()}>Go</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default MetaDataFilter;