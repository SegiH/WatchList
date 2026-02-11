import { ITableComponent, ITableComponentField, FieldTypes, FieldValueTypes } from "./ISegiTable";
import { useEffect, useRef, useState } from "react";
import React from "react";

import styles from "./SegiTable.module.css";

type SegiTableProps = {
     addingHasDisabledCheckboxPlaceholder?: boolean;
     addingText?: string;
     addtlPageSizes?: Record<number, string>;
     cancelEditCallBackHandler?: () => void;
     darkMode?: boolean,
     defaultPageSize?: number,
     editable?: boolean,
     exportable?: boolean,
     height?: string;
     isAdding?: boolean,
     isEditing?: boolean,
     pageSizeOverride?: Record<number, string>;
     paginationEnabled?: boolean,
     saveAddCallBackHandler?: (addComponent: ITableComponentField[]) => void;
     saveEditCallBackHandler?: (sectionData: any) => void;
     searchable?: boolean;
     setIsAdding?: (value: boolean) => void;
     setIsEditing?: (value: boolean) => void;
     showDisabled?: boolean;
     sortable?: boolean;
     tableTemplate: ITableComponent;
     width?: string;
}

const MIN_COLUMN_WIDTH = 80; // px
const COLUMN_STORAGE_KEY = "SegiTable.ColumnWidths";

const SegiTable = ({ addingHasDisabledCheckboxPlaceholder, addingText, addtlPageSizes, cancelEditCallBackHandler, darkMode, defaultPageSize, editable, exportable, height, isAdding, isEditing, pageSizeOverride, paginationEnabled, saveAddCallBackHandler, saveEditCallBackHandler, searchable, setIsAdding, setIsEditing, showDisabled, sortable, tableTemplate, width }: SegiTableProps) => {
     const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
     const [currentTableComponent, setCurrentTableComponent] = useState<ITableComponent>(null); // Used for table headers and when adding
     const [currentPage, setCurrentPage] = useState<number>(1);
     const [errorMessage, setErrorMessage] = useState("");
     const [expandedId, setExpandedId] = React.useState<string | null>(null);
     const [filteredTableData, setFilteredTableData] = useState(null);
     const [filterSearchTerm, setFilterSearchTerm] = useState("");
     const [hasExpandableCriteriaMet, setHasExpandableCriteriaMet] = useState(false);
     const [idVisible, setIDVisible] = useState(false);
     const [isError, setIsError] = useState(false);
     const [isExpandable, setIsExpandable] = useState(false);
     const [lastPage, setLastPage] = useState(false);
     const [lastPageNum, setLastPageNum] = useState(0);
     const [pageSize, setPageSize] = useState<number>(0);
     const [pageRecordStartEndLabel, setPageRecordStartEndLabel] = useState("");
     const [searchTerm, setSearchTerm] = useState("");
     const [sortColumn, setSortColumn] = useState("");
     const [sortDirection, setSortDirection] = useState("");
     const [tableData, setTableData] = useState(null); // Used when not adding (viewing or editing table)
     const [uniqueValuesVisibleColumn, setUniqueValuesVisibleColumn] = useState("");

     const hasRunInitialEffect = useRef(false); // Prevents the useEffect with no dependencies from re-rendering

     const defaultPageSizes = {
          5: "5",
          10: "10",
          25: "25",
          50: "50",
          0: "All"
     };

     const mergedPageSizes = typeof pageSizeOverride !== "undefined" ? pageSizeOverride : { ...defaultPageSizes, ...addtlPageSizes };

     const tableRef = useRef(null);

     const addClickHandler = () => {
          setIsAdding(true);
     }

     const addFieldChangeHandler = (fieldName: string, fieldValue: string | number | Date) => {
          const newComponent = Object.assign([], currentTableComponent);

          const currentFieldResult = newComponent.Fields.filter((currentField: ITableComponentField) => currentField.DatabaseColumn === fieldName);

          // This shouldn't ever happen!
          if (currentFieldResult.length !== 1) {
               alert(`Unable to update the field ${fieldName} because it could not be located`);
               return;
          }

          const currentField = currentFieldResult[0];

          switch (currentField.FieldValueType) {
               case FieldValueTypes.TEXT:
                    currentField.FieldValue = fieldValue as string;
                    break;
               case FieldValueTypes.NUMBER:
                    currentField.FieldValue = fieldValue as number;
                    break;
               /*case validFieldValueTypes.DATE:
                    currentField.FieldValue = fieldValue as Date;
                    break;*/
               default:
                    console.log("In TableComponent() defaulting to text");
                    currentField[0].FieldName = fieldValue as string;
                    break;
          }

          newComponent["IsModified"] = true;

          setCurrentTableComponent(newComponent);
     }

     const cancelAddClickHandler = () => {
          setIsAdding(false);
     }

     const editClickHandler = () => {
          setIsEditing(true);
     }

     const editFieldChangeHandler = (currentRow: any, fieldName: string, fieldValue: string | number | Date | boolean) => {
          const IDColumn = getIDColumn();

          // This shouldn't ever happen
          if (IDColumn === "") {
               alert("Unable to save this record because the ID column could not be determined");
               return;
          }

          const ID = currentRow[IDColumn];

          const newTableData = Object.assign([], tableData);

          const editedRowResult = newTableData.filter((data: any) => data[IDColumn] === ID);

          if (editedRowResult.length !== 1) {
               alert(`editFieldChangeHandler(): Unable to locate the row for ID ${ID}`);
               return;
          }

          const editedRow = editedRowResult[0];

          if (typeof editedRow[fieldName] === "undefined") {
               alert(`editFieldChangeHandler(): Unable to locate the column ${fieldName} row for ID ${ID}`);
               return;
          }

          editedRow[fieldName] = fieldValue;
          editedRow[fieldName + ".Modified"] = true;
          editedRow["IsModified"] = true;

          setTableData(newTableData);
     }

     const exportCSV = () => {
          const table = tableRef.current;

          // Initialize an array to hold the rows of the CSV data
          let csvData = [];
          const columnWidths = [];

          for (let i = 0; i < currentTableComponent.Fields.length; i++) {
               if (currentTableComponent.Fields[i].HiddenField !== true) {
                    columnWidths.push(0);
               }
          }

          // Loop through each row in the table
          const rows = table.querySelectorAll("tr");

          rows.forEach((row) => {
               let rowData = [];
               const cells = row.querySelectorAll("th, td");

               cells.forEach((cell, cellIndex) => {
                    let cellText = cell.innerText;
                    cellText = cellText.replace(String.fromCharCode(8593), "").replace(String.fromCharCode(8595), "");

                    // Remove comma from cell text since the output is CSV which is comma separated
                    cellText = cellText.replaceAll(",", "");

                    if ((!isExpandable || (isExpandable && cellIndex > 0))) {
                         rowData.push(cellText);

                         if (cellText.length > columnWidths[cellIndex - 1]) {
                              columnWidths[cellIndex - 1] = cellText.length;
                         }
                    }
               });

               csvData.push(rowData);
          });

          // Format the rows to ensure the columns are wide enough

          const formattedData = csvData.map(row => {
               return row.map((cellText, index) => {
                    // Pad each cell with spaces to ensure the column is wide enough
                    const requiredWidth = columnWidths[index];
                    const paddedCell = cellText + ' '.repeat(requiredWidth > cellText.length ? requiredWidth - cellText.length : cellText.length);
                    return paddedCell;
               }).join(",");  // Join the row with commas
          });

          // Join the rows with line breaks
          const csvContent = formattedData.join("\n");

          // Create a Blob object to download the CSV data
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);

          // Create an anchor element to simulate a click and download the file
          const a = document.createElement("a");
          a.href = url;
          a.download = "SegiTable.csv";  // You can change the file name to something meaningful
          a.click();

          // Clean up the URL object
          URL.revokeObjectURL(url);
     };

     const filterTableData = () => {
          if (tableData === null) {
               return;
          }

          const filterValues = currentTableComponent.Fields.filter((currentField: ITableComponentField) => typeof currentField.UniqueValuesSelected !== "undefined" && typeof currentField.UniqueValuesSelected === "object" && currentField.UniqueValuesSelected.length > 0);

          const newFilteredTableData = tableData?.filter((currentRow: any) => {
               let searchTermFound = false;

               if (searchTerm !== "") {
                    Object.keys(currentTableComponent.Fields).forEach((fieldKey: string) => {
                         const field = currentTableComponent.Fields[fieldKey];

                         if (field.SearchableField !== false) {
                              if (typeof field.SelectData === "undefined") {
                                   if (typeof currentRow[field.DatabaseColumn] !== "undefined" && String(currentRow[field.DatabaseColumn]).toLowerCase().includes(searchTerm.toLowerCase())) {
                                        searchTermFound = true;
                                   }
                              } else if (currentRow[field.DatabaseColumn] !== null && currentRow[field.DatabaseColumn] !== -1) {
                                   const selectDataResult = field.SelectData.filter((currentItem: any) => { return currentItem[field.SelectDataIDColumn] === currentRow[field.DatabaseColumn] });

                                   if (selectDataResult.length === 1) {
                                        const selectData = selectDataResult[0];

                                        if (selectData[field.SelectDataValueColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                                             searchTermFound = true;
                                        }
                                   }
                              }
                         }
                    });

                    if (!searchTermFound) {
                         return false;
                    }
               }

               if (filterValues.length > 0) {
                    const uniqueValuesSelected = filterValues[0].UniqueValuesSelected;

                    Object.keys(currentTableComponent.Fields).forEach((fieldKey: string) => {
                         const field = currentTableComponent.Fields[fieldKey];

                         uniqueValuesSelected.forEach((filterValue) => {
                              if (String(currentRow[field.DatabaseColumn]) == filterValue.toString()) {
                                   searchTermFound = true;
                              }
                         });
                    });

                    if (!searchTermFound) {
                         return false;
                    }
               }

               return (
                    (
                         (typeof showDisabled === "undefined" ||
                              ((showDisabled === false && (currentRow[getEnabledColumn()] === true || (isEditing && currentRow["IsModified"] === true)))
                                   ||
                                   (showDisabled === true)))
                    )
               )
          }).sort((a: any, b: any) => {
               if (sortColumn === "") {
                    return a;
               } else {
                    const fieldResult = currentTableComponent.Fields.filter((currentField: ITableComponentField) => currentField.DatabaseColumn === sortColumn);
                    const field = fieldResult[0];

                    // Sorting when the field is NOT a select type
                    if (typeof field.SelectData === "undefined") {
                         let aValue = a[sortColumn] !== null && typeof a[sortColumn] !== "undefined" ? a[sortColumn] : "";
                         let bValue = b[sortColumn] !== null && typeof b[sortColumn] !== "undefined" ? b[sortColumn] : "";

                         if (field.FieldValueType === FieldValueTypes.CURRENCY) {
                              return sortDirection === "ASC"
                                   ? parsePrice(aValue) - parsePrice(bValue)
                                   : parsePrice(bValue) - parsePrice(aValue);
                         } else if (field.FieldValueType === FieldValueTypes.DATE) {
                              return new Date(aValue).getTime() - new Date(bValue).getTime()
                         } else {
                              return aValue?.toString().toLowerCase() > bValue?.toString().toLowerCase() ? sortDirection === "ASC" ? 1 : -1 : sortDirection === "ASC" ? -1 : 1;
                         }
                    } else { // Sorting when the field is a select type
                         const aValueSelectDataResult = field.SelectData.filter((currentItem) => { return currentItem[field.SelectDataIDColumn] === a[sortColumn]; });

                         const bValueSelectDataResult = field.SelectData.filter((currentItem) => { return currentItem[field.SelectDataIDColumn] === b[sortColumn]; });

                         let aValue: string, bValue: string = "";

                         if (aValueSelectDataResult.length === 1) {
                              const aField = aValueSelectDataResult[0];

                              aValue = typeof aField[field.SelectDataValueColumn] !== "undefined" && aField[field.SelectDataValueColumn] !== null ? aField[field.SelectDataValueColumn] : "";
                         }

                         if (bValueSelectDataResult.length === 1) {
                              const bField = bValueSelectDataResult[0];

                              bValue = typeof bField[field.SelectDataValueColumn] !== "undefined" && bField[field.SelectDataValueColumn] !== null ? bField[field.SelectDataValueColumn] : "";
                         }

                         return aValue.toString().toLowerCase() > bValue.toString().toLowerCase() ? sortDirection === "ASC" ? 1 : -1 : sortDirection === "ASC" ? -1 : 1;
                    }
               }
          });

          let sliceStart: number;
          let sliceEnd: number;

          // Slice data if a page size is set
          if (pageSize != 0) {
               sliceStart = (currentPage - 1) * pageSize;
               sliceEnd = sliceStart + pageSize;
          } else {
               sliceStart = 0;
               sliceEnd = typeof newFilteredTableData !== "undefined" ? newFilteredTableData.length : 0;
          }

          if (newFilteredTableData === null) {
               return;
          }

          const newSlicedFilteredTableData = newFilteredTableData?.slice(sliceStart, sliceEnd);

          setFilteredTableData(newSlicedFilteredTableData);

          // Update page X/Y label
          if (pageSize != 0) {
               let newLastPageNum = Math.ceil(newFilteredTableData?.length / pageSize);

               setLastPageNum(newLastPageNum);

               if (currentPage === newLastPageNum) {
                    setLastPage(true);
               } else {
                    setLastPage(false);
               }

               const newPageRecordStartEndLabel = `${sliceStart + 1}-${sliceEnd + newSlicedFilteredTableData.length - pageSize} of ${newFilteredTableData.length}`;

               setPageRecordStartEndLabel(newPageRecordStartEndLabel);
          } else {
               setLastPageNum(1);

               setPageRecordStartEndLabel(`1-${typeof newFilteredTableData !== "undefined" ? newFilteredTableData.length : 1} of ${typeof newFilteredTableData !== "undefined" ? newFilteredTableData.length : 1}`);
          }

          // Check if row is expandable
          const newIsExpandableField = currentTableComponent.Fields.filter((field: ITableComponentField) => { return typeof field.ExpandableCriteria !== "undefined"; }).length === 0 ? false : true;

          const newIsExpandableGlobal = typeof currentTableComponent.ExpandableContent !== "undefined" ? true : false;

          if (newIsExpandableField || newIsExpandableGlobal) {
               setIsExpandable(true);
          }

          newFilteredTableData && newFilteredTableData.map((currentRow: any) => {
               if (isExpandable) {
                    const newExpandableContentResult = currentTableComponent.Fields.filter((field: ITableComponentField) => {
                         const uniqueMatchValues = field.ExpandableCriteria && field.ExpandableCriteria.map(e => e.Match).filter((v, i, a) => a.indexOf(v) === i);

                         // Select all is selected
                         const isAll = typeof uniqueMatchValues !== "undefined" ? uniqueMatchValues.includes("*") : false

                         return (
                              typeof uniqueMatchValues !== "undefined" &&
                              (uniqueMatchValues === null || (uniqueMatchValues !== null &&
                                   (
                                        ((typeof field.ExpandableCriteriaExactMatch === "undefined" || field.ExpandableCriteriaExactMatch === true) &&
                                             uniqueMatchValues.includes(currentRow[field.DatabaseColumn].toString()))
                                        ||
                                        (field.ExpandableCriteriaExactMatch === false && uniqueMatchValues.some(criteria => currentRow[field.DatabaseColumn].toString().toLowerCase().includes(criteria.toLowerCase())))
                                   )
                                   || isAll
                              )
                              )
                         )
                    });

                    if (newExpandableContentResult.length > 0) {
                         setHasExpandableCriteriaMet(true);
                    }
               } else if (typeof currentTableComponent.ExpandableContent !== "undefined") { // If template level ExpandableContent was provided
                    setIsExpandable(true);
                    setHasExpandableCriteriaMet(true);
               }
          });

     }

     const formatCurrency = (price, locale = 'en-US', currency = 'USD') => {
          price = price.replace("$", ""); // Remove dollar sign in case its already there so it doesn't break the formatting below

          return new Intl.NumberFormat(locale, {
               style: 'currency',
               currency,
          }).format(price);
     }

     const getEnabledColumn = () => {
          // Derive ID column from tableComponent
          const enabledFieldResult = currentTableComponent.Fields.filter((currentField: ITableComponentField) => currentField.IsEnabledColumn === true);

          if (enabledFieldResult.length === 0) {
               return ""
          }

          const enabledField = enabledFieldResult[0];

          const enabledColumn = enabledField.DatabaseColumn;

          return enabledColumn;
     }

     const getFormattedDate = (dateStr: string, separator: string, format?: string) => {
          const dateObj = dateStr !== null && typeof dateStr !== "undefined" ? new Date(dateStr) : new Date();

          // Extract year, month, and day from the date object
          const year = dateObj.getFullYear();
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
          const day = dateObj.getDate().toString().padStart(2, '0');

          // Format the date as yyyy-mm-dd
          const formattedDate = format !== "mm/dd/yyyy" ? `${year}-${month}-${day}` : `${month}-${day}-${year}`;

          // If separator is provided, replace hyphens with the separator
          if (separator && separator !== '-') {
               return formattedDate.replace(/-/g, separator);
          }

          return formattedDate;
     };

     const getIDColumn = () => {
          // Derive ID column from tableComponent
          const IDFieldResult = currentTableComponent.Fields.filter((currentField: ITableComponentField) => currentField.IsIDColumn === true);

          if (IDFieldResult.length === 0) {
               return "";
          }

          const IDField = IDFieldResult[0];

          if (typeof IDField.DatabaseColumn === "undefined") {
               return "";
          }

          const IDColumn = IDField.DatabaseColumn;

          return IDColumn;
     }

     const isVisible = (field: ITableComponentField) => {
          if (field.IsIDColumn === true && !isEditing) {
               return idVisible;
          }

          if (field.HiddenField !== true) {
               return true;
          }

          return false;
     }

     const pageClickHandler = (adjustValue: number = null, absoluteValue: number = null) => {
          if (adjustValue !== null) { // Adjust page relative to current page
               setCurrentPage(currentPage + adjustValue);

               if (currentPage + adjustValue < lastPageNum) {
                    setLastPage(false);
               } else {
                    setLastPage(true);
               }
          } else if (absoluteValue !== null) { // Set absolute page (first or last page)
               if (absoluteValue !== -1) {
                    setCurrentPage(absoluteValue);
                    setLastPage(false);
               } else { // Last page
                    setCurrentPage(lastPageNum);
                    setLastPage(true);
               }
          }
     }

     const pageSizeClickHandler = (newPageSize: number) => {
          localStorage.setItem("SegiTable.RowsPerPage", newPageSize.toString());
          setPageSize(newPageSize);
          setCurrentPage(1);
     }

     const parsePrice = (price: string): number => parseFloat(price.replace(/[^0-9.-]+/g, ""));

     const sortColumnClickHandler = (column: string) => {
          if (sortColumn === "" || (sortColumn !== "" && sortColumn !== column)) {
               setSortColumn(column);

               setSortDirection("ASC");
          } else if (sortColumn === column) {
               if (sortDirection === "ASC") {
                    setSortDirection("DESC");
               } else {
                    setSortDirection("ASC");
               }
          }
     }

     const toggleExpandableRow = (newId: number) => {
          if (typeof newId === "undefined") {
               alert("Value is not set. Make sure that ExpandableDataColumn is set in the template")
               return;
          }

          const stringId = String(newId);

          if (expandedId === stringId) {
               setExpandedId(null);
               localStorage.removeItem("SegiTable.LastOpenedId");
          } else {
               setExpandedId(stringId);
               localStorage.setItem("SegiTable.LastOpenedId", stringId);
          }

          const newComponent = Object.assign([], currentTableComponent);

          if (typeof newComponent.ExpandedRows === "undefined") {
               newComponent.ExpandedRows = [];
          }

          if (newComponent.ExpandedRows.includes(newId)) {
               const index = newComponent.ExpandedRows.indexOf(newId);

               // This shouldn't ever happen
               if (index === -1) {
                    alert(`${newId} was not found in expandedRows!`);
                    return;
               }

               newComponent.ExpandedRows.splice(index, 1);
          } else {
               if (currentTableComponent.MultiExpandableRows !== true) {
                    newComponent.ExpandedRows = [];
               }

               newComponent.ExpandedRows.push(newId);
               localStorage.setItem("SegiTable.LastOpenedId", newId.toString());
          }

          setCurrentTableComponent(newComponent);
     }

     const toggleIDColumn = () => {
          // Filter is visible
          if (uniqueValuesVisibleColumn !== "") {
               return;
          }

          setIDVisible(prevState => !prevState);
     }

     const uniqueValuesClearColumnClickHandler = () => {
          setUniqueValuesVisibleColumn("");
     }

     // Event when the user clicks on the filter icon to hide or show the filters for a column
     const uniqueValuesColumnClickHandler = (displayName: string) => {
          if (displayName !== uniqueValuesVisibleColumn) {
               setUniqueValuesVisibleColumn(displayName);
          } else {
               setUniqueValuesVisibleColumn("");
          }

          setFilterSearchTerm("");
     }

     // Event when the user clicks on a value in a column filter
     const uniqueValuesOptionClickHandler = (displayName: string, value?: string, selectAll?: boolean) => {
          const newTableComponent = Object.assign([], currentTableComponent);

          const thisFieldResult = newTableComponent.Fields.filter((currentField: ITableComponentField) => currentField.DisplayName === displayName);

          // this should never happen
          if (thisFieldResult.length !== 1) {
               console.log(`Error locating field with display name ${displayName}`)
               return;
          }

          const thisField = thisFieldResult[0];

          // Select all is not selected
          if (typeof selectAll === "undefined") {
               if (typeof thisField.UniqueValuesSelected === "undefined") {
                    thisField.UniqueValuesSelected = [value];
               } else {
                    // Check if the value is already in the array of selected values
                    const index = thisField.UniqueValuesSelected.indexOf(value);

                    // If its there remove it, otherwise add it
                    if (index !== -1) {
                         thisField.UniqueValuesSelected.splice(index, 1);
                    } else {
                         thisField.UniqueValuesSelected.push(value);
                    }
               }

               // Set Select all value
               if (thisField.UniqueValuesSelected.length === 0) {
                    thisField.UniqueValuesSelectAllSelected = true;
               } else {
                    thisField.UniqueValuesSelectAllSelected = false;
               }
          } else { // Select all has been selected/unselected
               if (typeof thisField.UniqueValuesSelected === "undefined") {
                    thisField.UniqueValuesSelected = [];
               }

               if (selectAll) {
                    thisField.UniqueValues.forEach((newValue) => {
                         thisField.UniqueValuesSelected.push(newValue);
                    });

                    thisField.UniqueValuesSelectAllSelected = true;
               } else {
                    thisField.UniqueValuesSelected = [];

                    thisField.UniqueValuesSelectAllSelected = false;
               }
          }

          setCurrentTableComponent(newTableComponent);

          setCurrentPage(1); // This will trigger the useEffect to recalculate the current page when the filter changes
     }

     const validateTableComponent = (tableTemplate: ITableComponent) => {
          // Some attributes are optional but if provided, rely on other attributes to work correctly
          // This method makes sure that the attributes passed to this component make sense
          // Some attributes that are conditionally used are set with a default value if not provided
          const newTableTemplate = Object.assign([], tableTemplate);

          if (typeof newTableTemplate.Data === "undefined") {
               setErrorMessage("SegiTable Error: The data property must be specified");
               setIsError(true);
               return ["ERROR"];
          }

          if (newTableTemplate.SemiTransparentTableHeader !== true && typeof newTableTemplate.SemiTransparentTableHeader !== "undefined") {
               setErrorMessage("SegiTable Error: The SemiTransparentTableHeader property must be not specified if SemiTransparentTableHeader is not set to true");
               setIsError(true);
               return ["ERROR"];
          }

          const isEditable = typeof editable !== "undefined" && editable === false ? false : true;

          // If editing is enabled
          if (isEditable) {
               if (typeof isAdding === "undefined") {
                    setErrorMessage("SegiTable Error: isAdding was not provided");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof isEditing === "undefined") {
                    setErrorMessage("SegiTable Error: isEditing was not provided");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof saveAddCallBackHandler === "undefined") {
                    setErrorMessage("SegiTable Error: saveAddCallBackHandler Callback was not provided and is required for an editable table");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof saveEditCallBackHandler === "undefined") {
                    setErrorMessage("SegiTable Error: saveEditCallBackHandler Callback was not provided and is required for an editable table");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof cancelEditCallBackHandler === "undefined") {
                    setErrorMessage("SegiTable Error: cancelEditCallBackHandler Callback was not provided and is required for an editable table");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof setIsAdding === "undefined") {
                    setErrorMessage("SegiTable Error: setIsAdding was not provided and is required for an editable table");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof setIsEditing === "undefined") {
                    setErrorMessage("SegiTable Error: setIsEditing was not provided and is required for an editable table");
                    setIsError(true);
                    return ["ERROR"];
               }
          } else {
               if (typeof addingHasDisabledCheckboxPlaceholder !== "undefined") {
                    setErrorMessage("SegiTable Error: addingHasDisabledCheckboxPlaceholder was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof addingText !== "undefined") {
                    setErrorMessage("SegiTable Error: addingText was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof cancelEditCallBackHandler !== "undefined") {
                    setErrorMessage("SegiTable Error: cancelEditCallBackHandler was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof isAdding !== "undefined") {
                    setErrorMessage("SegiTable Error: isAdding was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof isEditing !== "undefined") {
                    setErrorMessage("SegiTable Error: isEditing was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof saveAddCallBackHandler !== "undefined") {
                    setErrorMessage("SegiTable Error: saveAddCallBackHandler Callback was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof saveEditCallBackHandler !== "undefined") {
                    setErrorMessage("SegiTable Error: saveEditCallBackHandler Callback was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof setIsAdding !== "undefined") {
                    setErrorMessage("SegiTable Error: setIsAdding was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof setIsEditing !== "undefined") {
                    setErrorMessage("SegiTable Error: setIsEditing was provided but the table is not editable");
                    setIsError(true);
                    return ["ERROR"];
               }
          }

          // width & height validation
          if (typeof width !== "undefined" && width.toString().indexOf("px") === -1) {
               setErrorMessage("SegiTable Error: The width must be specified in px");
               setIsError(true);
               return ["ERROR"];
          }

          if (typeof height !== "undefined" && height.toString().indexOf("px") === -1) {
               setErrorMessage("SegiTable Error: The height must be specified in px");
               setIsError(true);
               return ["ERROR"];
          }

          // showDisabled validation
          if (typeof showDisabled !== "undefined" && showDisabled === true && newTableTemplate.Fields.filter((currentField: ITableComponentField) => currentField.IsEnabledColumn === true).length === 0) {
               setErrorMessage("SegiTable Error: showDisabled is true but there are no fields are marked as IsEnabledColumn");
               setIsError(true);
               return ["ERROR"];
          }

          // pagination validation
          if ((typeof paginationEnabled === "undefined" || paginationEnabled === false) && typeof defaultPageSize !== "undefined") {
               setErrorMessage("SegiTable Error: Pagination is not enabled but defaultPageSize was provided");
               setIsError(true);
               return ["ERROR"];
          }

          if ((typeof paginationEnabled === "undefined" || paginationEnabled === false) && typeof addtlPageSizes !== "undefined") {
               setErrorMessage("SegiTable Error: Pagination is not enabled but addtlPageSizes was provided");
               setIsError(true);
               return ["ERROR"];
          }

          if ((typeof paginationEnabled === "undefined" || paginationEnabled === false) && typeof pageSizeOverride !== "undefined") {
               setErrorMessage("SegiTable Error: Pagination is not enabled but pageSizeOverride was provided");
               setIsError(true);
               return ["ERROR"];
          }

          if (typeof defaultPageSize !== "undefined" && !Object.keys(mergedPageSizes).includes(defaultPageSize.toString())) {
               setErrorMessage(`SegiTable Error: The provided defaultPageSize ${defaultPageSize} is not a valid option in the page sizes ${Object.keys(mergedPageSizes).join(",")}`);
               setIsError(true);
               return ["ERROR"];
          } else if (typeof defaultPageSize === "undefined" && !Object.keys(mergedPageSizes).includes(pageSize.toString())) {
               setErrorMessage(`SegiTable Error: The pageSize ${pageSize} is not a valid option in the page sizes ${Object.keys(mergedPageSizes).join(",")}. Please use defaultPageSize with one of these choices`);
               setIsError(true);
               return ["ERROR"];
          }

          if (typeof addtlPageSizes !== "undefined" && typeof pageSizeOverride !== "undefined") {
               setErrorMessage(`SegiTable Error: addtlPageSizes and pageSizeOverride are both set. Only 1 of these props can be provided`);
               setIsError(true);
               return ["ERROR"];
          }

          if (typeof newTableTemplate.ExpandableDataLinked !== "undefined" && (typeof newTableTemplate.ExpandableDataColumn === "undefined" || newTableTemplate.ExpandableDataColumn === "")) {
               setErrorMessage(`SegiTable Error: ExpandableDataLinked was provided but ExpandableDataColumn was not provided`);
               setIsError(true);
               return ["ERROR"];
          }

          newTableTemplate.Fields.map((field: ITableComponentField, index: number) => {
               if (!isEditable) {
                    if (typeof field.Addable !== "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has Addable but the table is not editable`);
                         setIsError(true);
                         return ["ERROR"];
                    }

                    if (typeof field.DefaultAddValue !== "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has DefaultAddValue but the table is not editable`);
                         setIsError(true);
                         return ["ERROR"];
                    }
               }

               if (typeof field.Clickable === "undefined" && typeof field.ClickCallBack !== "undefined") {
                    field.Clickable = true;
               }

               if (typeof field.Clickable !== "undefined" && typeof field.ClickCallBack === "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has Clickable but ClickCallBack was not provided`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.ClickCallBack !== "undefined" && typeof field.TogglesIDColumn !== "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has both ClickCallBack and TogglesIDColumn set. You cannot set both of these properties. Only one of them can be set for a given field`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.DatabaseColumn === "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is missing the DatabaseColumn which is required for an editable table`);
                    setIsError(true);
                    return ["ERROR"];
               }

               // Validate display name first so I can reference the display name if an error is found later
               if (typeof field.DisplayName === "undefined") {
                    setErrorMessage(`SegiTable Error: The field at index ${index} is missing the DisplayName`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (field.ExpandableCriteriaExactMatch === true && typeof field.ExpandableCriteria == "undefined") {
                    setErrorMessage(`SegiTable Error: The field at index ${index} provided ExpandableCriteriaExactMatch but ExpandableCriteria was not provided`);
                    setIsError(true);
                    return ["ERROR"];
               }

               // ID Column is always read only so FieldType is not required
               if (!field.IsIDColumn) {
                    if (typeof field.FieldType === "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" does not have a field type`);
                         setIsError(true);
                         return ["ERROR"];
                    }

                    if (field.FieldType !== FieldTypes.TEXTAREA && field.FieldType !== FieldTypes.TEXTFIELD && field.FieldType !== FieldTypes.SELECT && field.FieldType !== FieldTypes.CHECKBOX) {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has an invalid field type ${field.FieldType}`);
                         setIsError(true);
                         return ["ERROR"];
                    }
               }

               if (typeof field.FieldValueType === "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" does not have a field value type`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (field.FieldValueType !== FieldValueTypes.BOOLEAN && field.FieldValueType !== FieldValueTypes.DATE && field.FieldValueType !== FieldValueTypes.NUMBER && field.FieldValueType !== FieldValueTypes.TEXT && field.FieldValueType !== FieldValueTypes.CURRENCY) {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has an invalid field value type ${field.FieldValueType}`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (field.FieldType == FieldTypes.SELECT) {
                    if (typeof field.SelectData === "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is marked as a select field but is missing SelectData`);
                         setIsError(true);
                         return ["ERROR"];
                    }

                    if (typeof field.SelectDataIDColumn === "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is marked as a select field but is missing SelectDataIDColumn`);
                         setIsError(true);
                         return ["ERROR"];
                    }

                    if (typeof field.SelectDataValueColumn === "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is marked as a select field but is missing SelectDataValueColumn`);
                         setIsError(true);
                         return ["ERROR"];
                    }

                    if (typeof field.SelectDataEnabledOnly !== "undefined" && field.SelectDataEnabledOnly === true && field.SelectDataEnabledOnlyColumn === "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has SelectDataEnabledOnly is marked as a select field SelectDataEnabledOnlyColumn is not set`);
                         setIsError(true);
                         return ["ERROR"];
                    }
               } else {
                    if (typeof field.SelectDataIDColumn !== "undefined") {
                         setErrorMessage(`SegiTable Error: The type for field "${field.DisplayName}" is not a select type but SelectDataIDColumn is set.`);
                         setIsError(true);
                         return ["ERROR"];
                    } else if (typeof field.SelectDataValueColumn !== "undefined") {
                         setErrorMessage(`SegiTable Error: The type for field "${field.DisplayName}" is not a select type but SelectDataValueColumn is set.`);
                         setIsError(true);
                         return ["ERROR"];
                    } else if (typeof field.SelectDataEnabledOnly !== "undefined") {
                         setErrorMessage(`SegiTable Error: The type for field "${field.DisplayName}" is not a select type but SelectDataEnabledOnly is set.`);
                         setIsError(true);
                         return ["ERROR"];
                    }
               }

               if (field.FieldType === FieldTypes.TEXTAREA) {
                    if (field.FieldValueType !== FieldValueTypes.TEXT && field.FieldValueType !== FieldValueTypes.NUMBER) {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is a text area but its type is not text or number`);
                         setIsError(true);
                         return ["ERROR"];
                    }
               } else {
                    if (typeof field.Rows !== "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is not a text area but provided rows property`);
                         setIsError(true);
                         return ["ERROR"];
                    }

                    if (typeof field.Columns !== "undefined") {
                         setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" is not a text area but provided columns property`);
                         setIsError(true);
                         return ["ERROR"];
                    }
               }

               if (field.IsEnabledColumn === true && newTableTemplate.Data.length > 0 && newTableTemplate.Data.filter((currentRow: any) => { return Object.keys(currentRow).includes(field.DatabaseColumn) }).length === 0) {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" has IsEnabledColumn set to true but refers to the database column ${field.DatabaseColumn} which does not exist in the data`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.IsEmailAddress !== "undefined" && typeof field.IsURL !== "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" provided both IsEmailAddress and IsURL. You can only provide one of these attributes for a given field`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.IsURL === "undefined" && typeof field.IsURLButton !== "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" provided IsURLButton but IsURL is not set`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.IsURL === "undefined" && typeof field.IsURLHrefColumn !== "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" provided IsURLHrefColumn but IsURL is not set`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.IsURL === "undefined" && typeof field.IsURLText !== "undefined") {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" provided IsURLText but IsURL is not set`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.IsURLText !== "undefined" && typeof field.IsURLHrefColumn !== "undefined") {
                    setErrorMessage(`SegiTable Error: One IsURLText or IsURLHrefColumn can be provided but not both`);
                    setIsError(true);
                    return ["ERROR"];
               }

               if (typeof field.Rows !== "undefined" && field.FieldType !== FieldTypes.TEXTAREA) {
                    setErrorMessage(`SegiTable Error: The field "${field.DisplayName}" provided Rows but this field is not a text area`);
                    setIsError(true);
                    return ["ERROR"];
               }
          });

          return ["OK", newTableTemplate];
     }

     // Initialization use effect
     useEffect(() => {
          if (hasRunInitialEffect.current) return;

          const validatedTableComponentResult: any = validateTableComponent(tableTemplate);

          if (validatedTableComponentResult[0] !== "OK") {
               return;
          }

          const validatedTableComponent = validatedTableComponentResult[1];

          // Build filter values
          validatedTableComponent.Fields.map((field: ITableComponentField, index: number) => {
               if (field.Filterable === true && !field.IsIDColumn && !field.IsEnabledColumn && (field.FieldType === FieldTypes.TEXTFIELD || field.FieldType === FieldTypes.SELECT) && field.DisplayName !== "Notes") {
                    field.UniqueValues = Array.from(
                         new Set(
                              tableTemplate.Data
                                   .map(item => item[field.DatabaseColumn])
                                   .filter(name => name !== null && name !== "")
                                   .sort((a: any, b: any) => {
                                        if (field.FieldValueType === FieldValueTypes.CURRENCY) {
                                             // Always return in ASC order
                                             return parsePrice(a) - parsePrice(b);
                                        } else if (field.FieldValueType === FieldValueTypes.DATE) {
                                             return new Date(a).getTime() - new Date(b).getTime()
                                        } else {
                                             return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1;
                                        }
                                   })
                         )
                    );

                    // Ensures that select all is checked and all items are checkedxx 
                    field.UniqueValuesSelectAllSelected = true;
               }
          });

          setCurrentTableComponent(validatedTableComponent);

          setTableData(tableTemplate.Data);

          if (typeof defaultPageSize !== "undefined") {
               setPageSize(defaultPageSize);
          }

          const savedRowsPerPage = localStorage.getItem("SegiTable.RowsPerPage");

          if (typeof savedRowsPerPage !== "undefined" && savedRowsPerPage !== null && savedRowsPerPage) {
               setPageSize(parseInt(savedRowsPerPage, 10));
          }

          const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
          if (saved) {
               setColumnWidths(JSON.parse(saved));
          }

          hasRunInitialEffect.current = true;
     }, []);

     // useEffect that triggers the filtering of the table data
     useEffect(() => {
          if (tableData !== null) {
               filterTableData();
          }
     }, [currentPage, pageSize, searchTerm, sortColumn, sortDirection, tableData]);

     // useEffect that is triggered when one of the filter values on a column has been changed
     useEffect(() => {
          if (currentTableComponent && currentTableComponent.Fields.filter((currentField: ITableComponentField) => typeof currentField.UniqueValuesSelected !== "undefined" && typeof currentField.UniqueValuesSelected === "object" && currentField.UniqueValuesSelected.length >= 0).length > 0) {
               filterTableData();
          }
     }, [currentTableComponent]);

     // This will trigger the useEffect to recalculate the current page when the searchTerm changes
     useEffect(() => {
          setCurrentPage(1);
     }, [searchTerm]);

     useEffect(() => {
          localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(columnWidths));
     }, [columnWidths]);

     return (
          <div className={`${styles.SegiTable}`} style={{ width: typeof width !== "undefined" ? width : "100%" }}>
               {isError &&
                    <div>{errorMessage}</div>
               }

               {!isError && filterTableData && hasRunInitialEffect.current === true &&
                    <span className="SegiTable">
                         {filterTableData && expandedId === null &&
                              <SegiTableControls addClickHandler={addClickHandler} addingText={addingText} cancelAddClickHandler={cancelAddClickHandler} cancelEditCallBackHandler={cancelEditCallBackHandler} currentTableComponent={currentTableComponent} editable={editable} editClickHandler={editClickHandler} exportable={exportable} exportCSV={exportCSV} isAdding={isAdding} isEditing={isEditing} saveAddCallBackHandler={saveAddCallBackHandler} saveEditCallBackHandler={saveEditCallBackHandler} searchable={searchable} searchTerm={searchTerm} setSearchTerm={setSearchTerm} tableData={tableData} />
                         }

                         {tableData &&
                              <>
                                   {/* Add row table */}
                                   {isAdding &&
                                        <SegiTableAddRow addFieldChangeHandler={addFieldChangeHandler} addingHasDisabledCheckboxPlaceholder={addingHasDisabledCheckboxPlaceholder} currentTableComponent={currentTableComponent} darkMode={darkMode} idVisible={idVisible} isAdding={isAdding} />
                                   }

                                   {tableData.length === 0 && currentTableComponent.ExpandableDataLinked !== true &&
                                        <span style={{ fontSize: "24px", fontWeight: "bold" }}>No Data</span>
                                   }

                                   {tableData.length > 0 && (currentTableComponent.ExpandableDataLinked !== true || (currentTableComponent.ExpandableDataLinked === true)) &&
                                        <SegiTableDataGrid columnWidths={columnWidths} currentPage={currentPage} currentTableComponent={currentTableComponent} darkMode={darkMode} editFieldChangeHandler={editFieldChangeHandler} expandedId={expandedId} filteredTableData={filteredTableData} filterSearchTerm={filterSearchTerm} formatCurrency={formatCurrency} getFormattedDate={getFormattedDate} hasExpandableCriteriaMet={hasExpandableCriteriaMet} height={height} isAdding={isAdding} isEditing={isEditing} isExpandable={isExpandable} isVisible={isVisible} lastPage={lastPage} lastPageNum={lastPageNum} mergedPageSizes={mergedPageSizes} pageClickHandler={pageClickHandler} pageRecordStartEndLabel={pageRecordStartEndLabel} pageSize={pageSize} pageSizeClickHandler={pageSizeClickHandler} paginationEnabled={paginationEnabled} setColumnWidths={setColumnWidths} setCurrentTableComponent={setCurrentTableComponent} setExpandedId={setExpandedId} setFilterSearchTerm={setFilterSearchTerm} sortable={sortable} sortColumn={sortColumn} sortColumnClickHandler={sortColumnClickHandler} sortDirection={sortDirection} tableData={tableData} tableRef={tableRef} toggleIDColumn={toggleIDColumn} toggleExpandableRow={toggleExpandableRow} uniqueValuesClearColumnClickHandler={uniqueValuesClearColumnClickHandler} uniqueValuesColumnClickHandler={uniqueValuesColumnClickHandler} uniqueValuesOptionClickHandler={uniqueValuesOptionClickHandler} uniqueValuesVisibleColumn={uniqueValuesVisibleColumn} />
                                   }
                              </>
                         }
                    </span >
               }
          </div >
     )
};

type SegiTableControlsProps = {
     addClickHandler: () => void;
     addingText?: string;
     cancelAddClickHandler: () => void;
     cancelEditCallBackHandler: () => void;
     currentTableComponent: ITableComponent;
     editable: boolean;
     editClickHandler: () => void;
     exportable: boolean;
     exportCSV: () => void;
     isAdding: boolean;
     isEditing: boolean;
     saveAddCallBackHandler: (addComponent: ITableComponentField[]) => void;
     saveEditCallBackHandler: (sectionData: any) => void;
     searchable: boolean;
     searchTerm: string;
     setSearchTerm: (value: string) => void;
     tableData: any;
}

const SegiTableControls = ({ addClickHandler, addingText, cancelAddClickHandler, cancelEditCallBackHandler, currentTableComponent, editClickHandler, editable, exportable, exportCSV, isAdding, isEditing, saveAddCallBackHandler, saveEditCallBackHandler, searchable, searchTerm, setSearchTerm, tableData }: SegiTableControlsProps) => {
     return (
          <>
               {/* Export to Excel icon */}
               {exportable && !isAdding && !isEditing && exportable &&
                    <img alt="Excel" className={`${styles.SegiTableExcelIcon} ${typeof editable === "undefined" || (typeof editable !== "undefined" && editable !== false) ? `${styles.SegiTableExcelIconEditable}` : `${styles.SegiTableExcelIconReadOnly}`}`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAqFBMVEUdcET///8AZTHe5+EQbD7Q3NRtnIHq8u5tmX8AYiwAajnu8u8AZDCZtaRIg2EObD11noVfkHOJq5aov7HI1s0jckdXjG34+/lXlHQAYCdFiWWzzL8weFCIs5zh7efY5d6dwqyjwrE3g1t/p5AqelBWkG+30cOCr5W2y7/T3thBgV2qybnF3c+Lrpq0yb0wf1Z6rJDO4tZIjmkAWx0AVQihu6s3elSRuaRS4H3gAAAHhElEQVR4nO2dbUOqPBiAASfkUKcmwjGV8AULMvOck/3/f/bwUmxak3nC3Hju6yNji6sbuLcxUNMAAAAAAAAAAAAAAAAAAAAA4LIghDG+9kFcCkSwoY29zsNrDRWTwLWW3vqu2bAsV380rn08FZKelO3W3HsLbdd19ZxmLQwRQprjTCJvGs70I1Q3RIgQZx+NzHX8ZB3LqW6Y3EvQdtxfbIJw534pp65h4oa1+WrRuQ13n85K1Q0TufZ2Zb4+D5u+XSanmiHChrH11kGzMbNOnJVKGqZJwJib90Pbds9wU8AwTQJJFkgTXOnlppwhIijJb6P+Oj51n1TTMLmXaNuo30uSgP9NOekMk06XsRx7aRLgZG+FDdMMtxybnSQJNKoInFSGySiHzL1p/OiflQTUMES4hbcvaRKwL+F2fUO0isW6JeoamtXdT0oMSRUgiQ1Jrwpu9uc6/pxhq5KW3GBfc0Pd7ZOaG+o3Z56mYFgNlRrCWQqGFwEMz0FeQzLgMUx3cRfc8sGgo4Qht1/azo7f/sXvjOJIDUMeODdsnTjI7v/LUNp8WJlh/WNYf0M4S9U3hBiCIRiCIRiCIRjKbIg4GO/jQ145QkSN8WH9ZzHAUBQwBMPzcX3/KY6D4NQqgNQQ9TmMbtNd7BGvPKF3LcPYiyaTieM4SUNvp3b8ZrY4nE2senzoJti2OwzD+/XusMhf4Y//J+qebEbqjB/P51uj1TIwxu3B4Zl4t6TNrE82IrXhbFK0iMY+W2Iv6FsUzul1i1Ib6iZtET0fHPa8KCAvp9uQ29BvU5EFs7Mb0EveKFl6Kreh/ps2uWROU2tVbCdeSROSGz7RIOI7unlIr0Ls82urYOiOmXtNsQjO9ZgQlq35k9xQD5hoNT42zuhBk2FZC7IbWvOiUVzkvZfiPkPKm5Dd0O3QIC4/TkimiYfSFmQ31Ju089J+yjeFxTGTfvlbCtIbuoMiiOg9MdBUoQUC/yLZDfU7pkZ2mu6cooFVWapQwtDqFfcVFKQb1jSBbATqKzDXFtAKq9S4S4dNAiHMR8AjHvkIuMstH41uLm84o9fdPlEKipNUm4pUV2EWY0OrbHSLjjcmIiFUwtAvllejvvtUjJuIKVRbBUNmmLgPO8V9B4u9saeE4Y72a1bFRYl+i1VWwlAff9FyW+gqfM8WDgeUZwuDV+442s88ewo/f9uCmIKvSn0z45Mfero2/1QZNwWryt+nyQiOg0g80bqKGFrL48rlwya1DNlhYlbVE365WxFDvekcVCWBeE1FDK0X9qGI0LBJMUP9gW2cDMQrqmLobtgLEUW78iqKGTYPb6akI/xqtCKG7vToXjoWvhAVMZwd50NyLxpERQzfjvs0aFyvPo37uWX2QU0NDNdfrBDYCn6tQImV7G7RsEO7NkZwhqHsb3bdfxii7oIqbsUNyWKw+JqsA2/3OKUpP/F2HjND2vP7xR9ph8KGss9i3Bc1lrFOZ6Ky+eFyFDCkM8Koa+vDiDYgdDtVwJCZ1Z8mdx3mMYbQhKn8hpZJldJ+TEy7NxORKzEzrOgDP5d+upYvLGFXmvQEjjzLFi0Of7KnV/ZfXnmr9WtyaUMmhEb+DHhKW9iXrlNQIOM/0N3n+RafpkS0KQ+i7L02mwlh/L6NrqZBUfmsqeyGPt19+7E3XamgkbfSIMpuSENI1oUMM5RaNk7VVsCwwYTrsdg6pRc8DhQ3pGsT2Z0tNohlbchtaNE/za5+ck0miCeXsVdtWHm2eGG62ezU05Cd1Ci510gdQ39S7EsOMp/FPDI1SvrfUsdwQfeNntgCl/k5ABTxql/AsOIY7iJuD7S5ZZqJOfXlN9xkb1okEKQFh0X2gp4vaKSsYfZe0y64D0xzfbznnYboyqGTQZTbkM+s1x3t9/ul42gEm6cmFlU11K2ZFYZhHASdwWBz6iFGZog5tHLDP7xyjA053gMuezsP33J4zcYm7iuvPIF9V0feb5vIPU/zXeDLkOcAMbyeodHgkecZbnEKayhtDDWDw588W/zllRtGa6+GIY9rjy3kM4QYqm9Y/xiCofqGcB2qbwgxBEMwBMPLG8Kd5nqGmDP6+/U+m8gfH7YPxofSxhAPeWQjeJdbnMCuhZA3hjATJQoYguFlAMNzkDdbQAxFgRgqb8h8ZUU2Q/6TmXNo9s8U/NEnM+0KMM4V1JDAl7oqMrwW+94muNtdOJBXNdQQ1ibdfm8RhOJvn6tlmFkmOJOou1rH4i9oK2X4Tv7tsOXvt7jii1Maw3cQwW0yNiv8rW7ZDDMQwgbeeuu7ZgW/ty6lYU4azu3Y7DwPm/43fqFcYsOMRBM789WiE4S7f7tAZTfMSTyztDL4h7SihmEGQiRNKyPzJX46o5egkGFOmlM0zdl701D8i3RKgjBuG3PvLbRs9+TtVlnDnMSzNU/TSoObVhQ3zEjuQ8Zy7GVp5fMFWgfDjKSXgLVo1evchju/loY5iSdZjleLzVu4s2tpmJGkFaLto9HNIkjSymMNDXOytLKcRF99N7NWoLoLAgAAAAAAAAAAAAAAAAAAAD8K/52bmqBVsrpTZjSh5+0q8x/REgMbo6miWAAAAABJRU5ErkJggg==" onClick={exportCSV} width={45} height={45} />
               }

               {/* Buttons */}
               {!isAdding && !isEditing && (typeof editable === "undefined" || (typeof editable !== "undefined" && editable !== false)) &&
                    <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableSaveButton}`} onClick={() => editClickHandler()}>Edit</button>
               }

               {/* Search field */}
               {!isAdding && !isEditing && searchable &&
                    <input id="search" className={`${!exportable && styles.SegiTableMarginTop15} ${(exportable || editable !== false) && styles.SegiTableMarginLeft25} ${styles.SegiTableInputStyle}`} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="  Search"></input>
               }

               {isEditing && !isAdding &&
                    <table>
                         <tbody>
                              <tr>
                                   <td>
                                        <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableSaveButton}`} onClick={() => saveEditCallBackHandler(tableData)}>Save</button>
                                        <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableCancelButton}`} onClick={() => cancelEditCallBackHandler()}>Cancel</button>
                                        <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableAddButton}`} onClick={() => addClickHandler()}>{typeof addingText !== "undefined" ? addingText : "Add"}</button>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               }

               {isAdding &&
                    <div>
                         <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableSaveButton}`} onClick={() => saveAddCallBackHandler(currentTableComponent.Fields)}>{typeof addingText !== "undefined" ? addingText : "Add"}</button>
                         <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableCancelButton}`} onClick={() => cancelAddClickHandler()}>Cancel</button>
                    </div>
               }
          </>
     )
}

export default SegiTable;

type SegiTableAddRowProps = {
     addFieldChangeHandler: (fieldName: string, fieldValue: string | number | Date) => void;
     addingHasDisabledCheckboxPlaceholder: boolean;
     currentTableComponent: ITableComponent;
     darkMode: boolean;
     idVisible: boolean;
     isAdding: boolean;
}

const SegiTableAddRow = ({ addFieldChangeHandler, addingHasDisabledCheckboxPlaceholder, currentTableComponent, darkMode, idVisible, isAdding }: SegiTableAddRowProps) => {
     return (
          <table className={styles.SegiTableMarginBottom25}>
               <thead>
                    <tr className={`${!darkMode ? `lightMode` : `darkMode`}`}>
                         {currentTableComponent && currentTableComponent.Fields
                              .filter((field: ITableComponentField) => {
                                   return (
                                        (isAdding && (typeof field.Addable === "undefined" || (typeof field.Addable !== "undefined" && field.Addable !== false))
                                             ||
                                             (!isAdding && (field?.HiddenField !== true || (field?.HiddenField === true && idVisible))))
                                   )
                              }).map((field: ITableComponentField, index: number) => {
                                   return (
                                        <th key={index} className={`${styles.SegiTableDataCell} ${styles.SegiTableDataGridHeader} ${field.IsIDColumn === true ? `${styles.SegiTableIDColumn}` : ""} ${field.Clickable ? `${styles.SegiTableClickable}` : ""} ${!darkMode ? `lightMode` : `darkMode`}`}>{field.DisplayName}</th>
                                   )
                              })}

                         {isAdding && currentTableComponent && addingHasDisabledCheckboxPlaceholder &&
                              <th className={`${styles.SegiTableDataCell} ${styles.SegiTableDataGridHeader} ${!darkMode ? `lightMode` : `darkMode`}`}>Enabled</th>
                         }
                    </tr>
               </thead>

               <tbody>
                    <tr className={`${!darkMode ? `lightMode` : `darkMode`}`}>
                         {currentTableComponent.Fields.filter((field: ITableComponentField) => {
                              return (typeof field.Addable == "undefined" || (typeof field.Addable != "undefined" && field.Addable != false))
                         }).map((field: ITableComponentField, index: number) => {
                              return (
                                   <React.Fragment key={index} >
                                        {isAdding &&
                                             <td className={styles.SegiTableDataCell}>
                                                  {field.FieldType === FieldTypes.TEXTFIELD && field.Disabled !== true &&
                                                       <>
                                                            <input className={styles.SegiTableInputStyle} value={typeof field.FieldValue !== "undefined" ? field.FieldValue : typeof field.DefaultAddValue !== "undefined" ? field.DefaultAddValue : ""} required={field.Required === true ? true : false} onChange={(event) => addFieldChangeHandler(field.DatabaseColumn, event.target.value)}></input>
                                                       </>
                                                  }

                                                  {field.FieldType === FieldTypes.TEXTAREA &&
                                                       <>
                                                            <textarea rows={typeof field.Rows !== "undefined" ? field.Rows : 10} cols={typeof field.Columns !== "undefined" ? field.Columns : 10} className={`${styles.SegiTableInputStyle} ${styles.SegiTableInputStyleFullWidth}`} value={typeof field.FieldValue !== "undefined" ? field.FieldValue : typeof field.DefaultAddValue !== "undefined" ? field.DefaultAddValue : ""} required={field.Required === true ? true : false} onChange={(event) => addFieldChangeHandler(field.DatabaseColumn, event.target.value)} />
                                                       </>
                                                  }

                                                  {field.FieldType === FieldTypes.SELECT && field.Disabled !== true &&
                                                       <select className={`${styles.SegiTableSolidBorder} ${styles.SegiTableSelectStyle}`} value={typeof field.FieldValue !== "undefined" ? field.FieldValue : typeof field.DefaultAddValue !== "undefined" ? field.DefaultAddValue : ""} required={field.Required === true ? true : false} onChange={(event) => addFieldChangeHandler(field.DatabaseColumn, event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {field.SelectData?.filter((currentItem) => (field.SelectDataEnabledOnly !== true || (field.SelectDataEnabledOnly === true && currentItem[field.SelectDataEnabledOnlyColumn] === true)))
                                                                 .map((currentItem, index: number) => {
                                                                      return <option key={index} value={currentItem[field.SelectDataIDColumn]}>{`${currentItem[field.SelectDataValueColumn]}`}</option>
                                                                 })}
                                                       </select>
                                                  }

                                                  {field.FieldType === FieldTypes.TEXTFIELD && field.Disabled === true &&
                                                       <div>{field.FieldValue}</div>
                                                  }

                                                  {field.FieldType === FieldTypes.SELECT && field.Disabled === true &&
                                                       field.SelectData?.filter((currentItem) => (field.DatabaseColumn === currentItem[field.SelectDataValueColumn])).length === 1 &&
                                                       <div>{field.SelectData?.filter((currentItem) => (field.DatabaseColumn === currentItem[field.SelectDataValueColumn]))[0][field.SelectDataValueColumn]}</div>
                                                  }
                                             </td>
                                        }
                                   </React.Fragment>
                              )
                         })}

                         {isAdding && addingHasDisabledCheckboxPlaceholder &&
                              <td className={styles.SegiTableDataCell}>
                                   <input id="addDisabledEnabledCheckbox" name="addEnabled" className={`${styles.SegiTableInputStyle}`} type="checkbox" disabled checked={true}></input>
                              </td>
                         }
                    </tr>
               </tbody>
          </table>
     )
}

type SegiTableDataGridProps = {
     columnWidths: Record<string, number>;
     currentPage: number;
     currentTableComponent: ITableComponent;
     darkMode: boolean;
     editFieldChangeHandler: (currentRow: any, fieldName: string, fieldValue: string | number | Date) => void;
     expandedId: string;
     filteredTableData: any;
     filterSearchTerm: string;
     formatCurrency: (price: string, locale?: string, currency?: string) => string;
     getFormattedDate: (dateStr: string, separator: string, format?: string) => string;
     hasExpandableCriteriaMet: boolean;
     height: string;
     isAdding: boolean;
     isEditing: boolean;
     isExpandable: boolean;
     isVisible: (field: ITableComponentField) => void;
     lastPage: boolean;
     lastPageNum: number;
     mergedPageSizes: Record<number, string>;
     pageClickHandler: (adjustValue?: number, absoluteValue?: number) => void;
     pageRecordStartEndLabel: string;
     pageSize: number;
     pageSizeClickHandler: (value: number) => void;
     paginationEnabled: boolean,
     setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
     setCurrentTableComponent: (value: ITableComponent) => void;
     setExpandedId: (value: string | null) => void;
     setFilterSearchTerm: (value: string) => void;
     sortable: boolean;
     sortColumn: string;
     sortColumnClickHandler: (value: string) => void;
     sortDirection: string;
     tableData: any;
     tableRef: any;
     toggleIDColumn: () => void;
     toggleExpandableRow: (newId: number) => void;
     uniqueValuesClearColumnClickHandler: () => void;
     uniqueValuesColumnClickHandler: (value: string) => void;
     uniqueValuesOptionClickHandler: (displayName: string, value?: string, selectAll?: boolean) => void;
     uniqueValuesVisibleColumn: string;
}

const SegiTableDataGrid = ({ columnWidths, currentPage, currentTableComponent, darkMode, editFieldChangeHandler, expandedId, filteredTableData, filterSearchTerm, formatCurrency, getFormattedDate, hasExpandableCriteriaMet, height, isAdding, isEditing, isExpandable, isVisible, lastPage, lastPageNum, mergedPageSizes, pageClickHandler, pageRecordStartEndLabel, pageSize, pageSizeClickHandler, paginationEnabled, setColumnWidths, setCurrentTableComponent, setExpandedId, setFilterSearchTerm, sortable, sortColumn, sortColumnClickHandler, sortDirection, tableData, tableRef, toggleIDColumn, toggleExpandableRow, uniqueValuesClearColumnClickHandler, uniqueValuesColumnClickHandler, uniqueValuesOptionClickHandler, uniqueValuesVisibleColumn }: SegiTableDataGridProps) => {
     return (
          <div>
               <div id={`${styles.SegiTableGridContent}`} className={`${styles.SegiTableGridContent}`} style={{ height: typeof height !== "undefined" ? height : "auto", overflow: "auto" }}>
                    <table className={`${styles.SegiTableDataGrid}`} ref={tableRef}>
                         {/* Table Headers */}
                         {
                              <SegiTableDataGridHeaders columnWidths={columnWidths} currentTableComponent={currentTableComponent} darkMode={darkMode} expandedId={expandedId} filterSearchTerm={filterSearchTerm} hasExpandableCriteriaMet={hasExpandableCriteriaMet} isEditing={isEditing} isExpandable={isExpandable} isVisible={isVisible} setColumnWidths={setColumnWidths} setFilterSearchTerm={setFilterSearchTerm} sortable={sortable} sortColumn={sortColumn} sortColumnClickHandler={sortColumnClickHandler} sortDirection={sortDirection} toggleIDColumn={toggleIDColumn} uniqueValuesClearColumnClickHandler={uniqueValuesClearColumnClickHandler} uniqueValuesColumnClickHandler={uniqueValuesColumnClickHandler} uniqueValuesOptionClickHandler={uniqueValuesOptionClickHandler} uniqueValuesVisibleColumn={uniqueValuesVisibleColumn} />
                         }

                         {/* Table body */}
                         <SegiTableDataGridBody currentTableComponent={currentTableComponent} darkMode={darkMode} editFieldChangeHandler={editFieldChangeHandler} expandedId={expandedId} filteredTableData={filteredTableData} formatCurrency={formatCurrency} getFormattedDate={getFormattedDate} isEditing={isEditing} isExpandable={isExpandable} isVisible={isVisible} onToggleExpandableRow={toggleExpandableRow} setCurrentTableComponent={setCurrentTableComponent} setExpandedId={setExpandedId} />
                    </table>
               </div>

               {paginationEnabled && tableData.length > 0 && !isAdding && !isEditing && expandedId === null &&
                    <SegiTablePagination currentPage={currentPage} darkMode={darkMode} lastPage={lastPage} lastPageNum={lastPageNum} mergedPageSizes={mergedPageSizes} pageClickHandler={pageClickHandler} pageRecordStartEndLabel={pageRecordStartEndLabel} pageSize={pageSize} pageSizeClickHandler={pageSizeClickHandler} />
               }
          </div>
     )
}

type SegiTableDataGridHeadersProps = {
     columnWidths: Record<string, number>;
     currentTableComponent: ITableComponent;
     darkMode: boolean;
     expandedId: string;
     filterSearchTerm: string;
     hasExpandableCriteriaMet: boolean;
     isEditing: boolean;
     isExpandable: boolean;
     isVisible: (field: ITableComponentField) => void;
     setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
     setFilterSearchTerm: (value: string) => void;
     sortable: boolean;
     sortColumn: string;
     sortColumnClickHandler: (value: string) => void;
     sortDirection: string;
     toggleIDColumn: () => void;
     uniqueValuesClearColumnClickHandler: () => void;
     uniqueValuesColumnClickHandler: (value: string) => void;
     uniqueValuesOptionClickHandler: (displayName: string, value?: string, selectAll?: boolean) => void;
     uniqueValuesVisibleColumn: string;
}

const SegiTableDataGridHeaders = ({ columnWidths, currentTableComponent, darkMode, expandedId, filterSearchTerm, hasExpandableCriteriaMet, isEditing, isExpandable, isVisible, setColumnWidths, setFilterSearchTerm, sortable, sortColumn, sortColumnClickHandler, sortDirection, toggleIDColumn, uniqueValuesClearColumnClickHandler, uniqueValuesColumnClickHandler, uniqueValuesOptionClickHandler, uniqueValuesVisibleColumn }: SegiTableDataGridHeadersProps) => {
     const activeColumnRef = useRef<string | null>(null);
     const defaultOpacity = '1';
     const startXRef = useRef(0);
     const startWidthRef = useRef(0);

     let eventDisabled = false;
     const spanRef = useRef(null);

     const onMouseDown = (
          e: React.MouseEvent,
          columnKey: string,
          currentWidth: number
     ) => {
          debugger
          if (expandedId !== null) {
               document.body.style.cursor = 'default'; 
               return;
          }

          document.body.style.cursor = 'col-resize';
          startXRef.current = e.clientX;
          startWidthRef.current = currentWidth;
          activeColumnRef.current = columnKey;

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
     }

     const onMouseMove = (e: MouseEvent) => {
          if (!activeColumnRef.current || expandedId !== null) return;

          const delta = e.clientX - startXRef.current;
          const newWidth = Math.max(
               MIN_COLUMN_WIDTH,
               startWidthRef.current + delta
          );

          setColumnWidths(prev => ({
               ...prev,
               [activeColumnRef.current!]: newWidth
          }));
     }

     const onMouseUp = () => {
          document.body.style.cursor = 'default'; 
          activeColumnRef.current = null;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
     }

     // When the filter span is visible, if you click outside of the span area, this use Effect will make sure that it closes
     useEffect(() => {
          function handleClickOutside(event) {
               if (eventDisabled === true) {
                    return;
               }

               if (spanRef.current && !spanRef.current.contains(event.target)) {
                    uniqueValuesClearColumnClickHandler();
                    eventDisabled = true; // Used to prevent clear filter from bein called too often because it causes filter span to cloe then reappear

                    setTimeout(() => {
                         eventDisabled = false;
                    }, 5000);
               }
          }

          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, []);

     return (
          <thead className={`styles.SegiTableDataGridHeaders`}>
               <tr
                    //className={`${darkMode ? `darkMode` : ``}`}
                    style={{
                         opacity:
                              typeof currentTableComponent.SemiTransparentTableHeaderOpacity !== "undefined"
                                   ? currentTableComponent.SemiTransparentTableHeaderOpacity
                                   : defaultOpacity
                    }}>
                    {isExpandable && hasExpandableCriteriaMet && !isEditing &&
                         <th style={{ width: "25px" }} className={`${styles.SegiTableDataCell} ${styles.SegiTableDataGridHeader} ${darkMode ? `darkMode` : ``}`}></th>
                    }

                    {currentTableComponent && currentTableComponent.Fields
                         .filter((field: ITableComponentField) => {
                              return isVisible(field)
                         }).map((field: ITableComponentField, index: number) => {
                              const columnKey = field.DatabaseColumn;
                              const width = columnWidths[columnKey] ?? parseInt(field.ColumnWidth || "150", 10);

                              return (
                                   <th key={index}
                                        style={{
                                             opacity: field.SemiTransparentTableColumn === true ? "0.8" : "1",
                                             borderWidth: "1px",
                                             width: columnWidths[field.DatabaseColumn] ?? parseInt(typeof field.ColumnWidth !== "undefined" ? field.ColumnWidth : "150", 10),
                                             minWidth: MIN_COLUMN_WIDTH
                                        }}
                                        className={`${styles.SegiTableDataCell} ${styles.SegiTableDataGridHeader} ${field.IsIDColumn === true ? `${styles.SegiTableIDColumn}` : ""} ${darkMode ? " darkMode" : ""}`} onDoubleClick={typeof field.TogglesIDColumn !== "undefined" ? toggleIDColumn : typeof field.ClickCallBack !== "undefined" ? field.ClickCallBack : null}>
                                        <span className={`${field.Clickable ? `${styles.SegiTableClickable}` : ""}`} style={{ marginLeft: "10px", userSelect: "none" }}>{field.DisplayName}</span>

                                        {sortable === true && field.SortableField !== false && !isEditing &&
                                             <>
                                                  {(sortColumn === "" || (sortColumn !== "" && sortColumn !== field.DatabaseColumn)) &&
                                                       <span className={`styles.SegiTableClickable`} onClick={() => sortColumnClickHandler(field.DatabaseColumn)}>
                                                            <span className={`${styles.SegiTableNoBorder} ${styles.SegiTableSortColumnUnselected} ${styles.SegiTableClickable}`}>&#8593;</span>
                                                       </span>
                                                  }

                                                  {sortColumn !== "" && sortColumn === field.DatabaseColumn && sortDirection === "ASC" &&
                                                       <span className={`styles.SegiTableClickable`} onClick={() => sortColumnClickHandler(field.DatabaseColumn)}>
                                                            <span className={`${styles.SegiTableNoBorder} ${styles.SegiTableSortColumnSelected} ${styles.SegiTableClickable}`}>&#8593;</span>
                                                       </span>
                                                  }

                                                  {sortColumn !== "" && sortColumn === field.DatabaseColumn && sortDirection === "DESC" &&
                                                       <span className={`styles.SegiTableClickable`} onClick={() => sortColumnClickHandler(field.DatabaseColumn)}>
                                                            <span className={`${styles.SegiTableNoBorder} ${styles.SegiTableSortColumnSelected} ${styles.SegiTableClickable}`}>&#8595;</span>
                                                       </span>
                                                  }
                                             </>
                                        }

                                        {field.Filterable === true && typeof field.UniqueValues !== "undefined" && !isEditing &&
                                             <div className={`${styles.SegiTableFilterIcon} ${styles.SegiTableClickable} ${!sortable ? styles.SegiTableMarginLeft25 : ""}`} onClick={() => uniqueValuesColumnClickHandler(field.DisplayName)}></div>
                                        }

                                        {uniqueValuesVisibleColumn === field.DisplayName &&
                                             <span className={styles.SegiTableFilterGrid} ref={spanRef}>
                                                  <input className={styles.SegiTableInputStyle} placeholder="search" value={filterSearchTerm} onChange={(event) => setFilterSearchTerm(event.target.value)} />

                                                  <table>
                                                       <tbody>
                                                            <tr>
                                                                 <td style={{ width: columnWidths[field.DatabaseColumn] ?? parseInt(field.ColumnWidth || "150", 10) }}>
                                                                      <input type="checkbox" className={styles.SegiTableFilterGridInput} checked={typeof field.UniqueValuesSelectAllSelected !== "undefined" && field.UniqueValuesSelectAllSelected === true ? field.UniqueValuesSelectAllSelected : false} onChange={(event) => uniqueValuesOptionClickHandler(field.DisplayName, null, event.target.checked)} /><span className={`${styles.SegiTableFilterGridOption} ${styles.SegiTableMarginLeft10}`}>(Select all)</span>
                                                                 </td>
                                                            </tr>

                                                            {field.UniqueValues
                                                                 .filter((uniqueValue: string, index: number) => {
                                                                      return (
                                                                           (filterSearchTerm === "" || (filterSearchTerm !== "" && uniqueValue.toString().toLowerCase().includes(filterSearchTerm.toLowerCase())))
                                                                      )
                                                                 }).map((uniqueValue: string, index: number) => {
                                                                      return (
                                                                           <tr key={index}>
                                                                                <td style={{
                                                                                     width:
                                                                                          columnWidths[field.DatabaseColumn] ??
                                                                                          parseInt(field.ColumnWidth || "150", 10)
                                                                                }}>
                                                                                     <input type="checkbox" className={styles.SegiTableInputStyle} checked={typeof field.UniqueValuesSelectAllSelected !== "undefined" && field.UniqueValuesSelectAllSelected === true ? true : typeof field.UniqueValuesSelected !== "undefined" ? field.UniqueValuesSelected?.includes(uniqueValue) : false} onChange={() => uniqueValuesOptionClickHandler(field.DisplayName, uniqueValue)} /><span className={`${styles.SegiTableFilterGridOption} ${styles.SegiTableMarginLeft10}`}>{uniqueValue}</span>
                                                                                </td>
                                                                           </tr>
                                                                      )
                                                                 })}
                                                       </tbody>
                                                  </table>
                                             </span>
                                        }

                                        <div
                                             className={expandedId === null ? styles.ColumnResizer : ""}
                                             onMouseDown={(e) =>
                                                  onMouseDown(e, columnKey, width)
                                             }
                                        />
                                   </th>
                              )
                         })}
               </tr>
          </thead>
     )
}

type SegiTableDataGridBodyProps = {
     currentTableComponent: ITableComponent;
     darkMode: boolean;
     editFieldChangeHandler: (currentRow: any, fieldName: string, fieldValue: string | number | Date) => void;
     expandedId: string;
     filteredTableData: any;
     formatCurrency: (price: string, locale?: string, currency?: string) => string;
     getFormattedDate: (dateStr: string, separator: string, format?: string) => string;
     isEditing: boolean;
     isExpandable: boolean;
     isVisible: (field: ITableComponentField) => void;
     onToggleExpandableRow: (value: number) => void;
     setCurrentTableComponent: (value: ITableComponent) => void;
     setExpandedId: (value: string | null) => void;
}

const SegiTableDataGridBody = ({ currentTableComponent, darkMode, editFieldChangeHandler, expandedId, filteredTableData, formatCurrency, getFormattedDate, isEditing, isExpandable, isVisible, onToggleExpandableRow, setCurrentTableComponent, setExpandedId }: SegiTableDataGridBodyProps) => {
     // Gets the URL display text
     const getURLText = (currentRow: [], field: any) => {
          return typeof field.IsURLDisplayTextColumn !== "undefined"
               ? currentRow[field.IsURLDisplayTextColumn]
               : typeof field.IsURLText !== "undefined"
                    ? field.IsURLText
                    : currentRow[field.DatabaseColumn]
     }

     return (
          <tbody>
               {!isEditing &&
                    <SegiTableDataGridBodyReadOnlyFields currentTableComponent={currentTableComponent} darkMode={darkMode} expandedId={expandedId} filteredTableData={filteredTableData} formatCurrency={formatCurrency} getFormattedDate={getFormattedDate} getURLText={getURLText} isExpandable={isExpandable} isVisible={isVisible} onToggleExpandableRow={onToggleExpandableRow} setCurrentTableComponent={setCurrentTableComponent} setExpandedId={setExpandedId} />
               }

               {isEditing &&
                    <SegiTableDataGridBodyEditableFields currentTableComponent={currentTableComponent} darkMode={darkMode} editFieldChangeHandler={editFieldChangeHandler} filteredTableData={filteredTableData} getFormattedDate={getFormattedDate} getURLText={getURLText} isVisible={isVisible} />
               }
          </tbody>
     )
}

type SegiTableDataGridBodyReadOnlyFieldsProps = {
     currentTableComponent: ITableComponent;
     darkMode: boolean;
     expandedId: string;
     filteredTableData: any;
     formatCurrency: (price: string, locale?: string, currency?: string) => string;
     getFormattedDate: (dateStr: string, separator: string, format?: string) => string;
     getURLText: (currentRow: [], field: any) => string;
     isExpandable: boolean;
     isVisible: (field: ITableComponentField) => void;
     onToggleExpandableRow: (value: number) => void;
     setCurrentTableComponent: (value: ITableComponent) => void;
     setExpandedId: (value: string | null) => void;
}

const SegiTableDataGridBodyReadOnlyFields = ({ currentTableComponent, darkMode, expandedId, filteredTableData, formatCurrency, getFormattedDate, getURLText, isExpandable, isVisible, onToggleExpandableRow, setExpandedId }: SegiTableDataGridBodyReadOnlyFieldsProps) => {
     useEffect(() => {
          const storedId = localStorage.getItem("SegiTable.LastOpenedId");
          localStorage.removeItem("SegiTable.LastOpenedId");

          if (!isExpandable && storedId && storedId !== "") {
               setExpandedId(storedId);
          }
     }, []);

     return (
          <>
               {typeof filteredTableData !== "undefined" && filteredTableData && filteredTableData
                    .filter((currentRow: any) => {
                         if (!expandedId) return true;

                         // Only show the expanded row
                         return String(currentRow[currentTableComponent.ExpandableDataColumn]) === String(expandedId);
                    })
                    .map((currentRow: any, rowIndex: number) => {
                         let expandableContent = null;
                         let expandableCriteriaMet = false;

                         // Match Field level 
                         if (isExpandable && typeof currentTableComponent.ExpandableContent !== "undefined") { // Uses template level expandable content
                              expandableCriteriaMet = true;
                              expandableContent = currentTableComponent.ExpandableContent;
                         }

                         let newDarkMode = "";

                         if (!darkMode && isExpandable) {
                              newDarkMode = `lightMode 1`;
                         } else {
                              if (rowIndex % 2 !== 0) {
                                   if (!expandableCriteriaMet && darkMode) {
                                        newDarkMode = `darkMode 1`;
                                   } else {
                                        newDarkMode = `lightMode 2`;
                                   }
                              } else if (expandedId !== null && rowIndex == parseInt(expandedId, 10) && rowIndex % 2 !== 0) {
                                   newDarkMode = `lightMode 3`;
                              } else if (rowIndex % 2 === 0 && expandableContent !== null) {
                                   if (expandedId !== null) {
                                        newDarkMode = `darkMode 2`;
                                   } else {
                                        if (rowIndex % 2 === 0 && expandableContent !== null) {
                                             newDarkMode = `darkMode 3`;
                                        }
                                   }
                              }
                         }

                         if (newDarkMode === "") {
                              if (rowIndex % 2 === 0 && !darkMode && expandedId === null) {
                                   newDarkMode = "darkMode 4";
                              } else {
                                   newDarkMode = "lightMode 4";
                              }
                         }

                         return (
                              <React.Fragment key={rowIndex}>
                                   <tr key={rowIndex} className={`${newDarkMode}`}>
                                        {isExpandable && expandableCriteriaMet &&
                                             <td className={`${styles.SegiTableDataCell}`} onClick={() => onToggleExpandableRow(currentRow[currentTableComponent.ExpandableDataColumn])}>
                                                  <div className={`${styles.SegiTableArrow} ${styles.SegiTableClickable}`}>{expandedId !== null && expandedId === String(currentRow[currentTableComponent.ExpandableDataColumn]) ? '▼' : '▶'}</div>
                                             </td>
                                        }

                                        {currentTableComponent.Fields
                                             .filter((field: ITableComponentField) => {
                                                  return isVisible(field)
                                             })
                                             .map((field: ITableComponentField, index: number) => {
                                                  return (
                                                       <td key={index} className={`${styles.SegiTableDataCell} ${field.IsIDColumn ? `${styles.SegiTableIDColumn}` : ""} ${field.Centered ? styles.SegiTableCentered : ""}`}>
                                                            {((field.FieldType === FieldTypes.TEXTFIELD || field.FieldType === FieldTypes.TEXTAREA) || field.IsIDColumn || field.Disabled === true) &&
                                                                 <>
                                                                      {!field.IsURL && !field.IsEmailAddress &&
                                                                           <>
                                                                                {field.FieldValueType === FieldValueTypes.DATE &&
                                                                                     <>
                                                                                          {currentRow[field.DatabaseColumn] !== null && currentRow[field.DatabaseColumn] !== "" &&
                                                                                               <div>{getFormattedDate(currentRow[field.DatabaseColumn], "/", "mm/dd/yyyy")}</div>
                                                                                          }
                                                                                     </>
                                                                                }

                                                                                {field.FieldValueType !== FieldValueTypes.DATE &&
                                                                                     <>
                                                                                          {field.FieldValueType !== FieldValueTypes.CURRENCY &&
                                                                                               <div>{currentRow[field.DatabaseColumn]}</div>
                                                                                          }

                                                                                          {field.FieldValueType === FieldValueTypes.CURRENCY &&
                                                                                               <>
                                                                                                    {currentRow[field.DatabaseColumn] !== null &&

                                                                                                         <div>{formatCurrency(currentRow[field.DatabaseColumn])}</div>

                                                                                                    }
                                                                                               </>
                                                                                          }
                                                                                     </>
                                                                                }
                                                                           </>
                                                                      }

                                                                      {field.IsURL &&
                                                                           <>
                                                                                {typeof field.IsURLButton === "undefined" &&
                                                                                     <div>
                                                                                          <a href={typeof currentRow[field.IsURLHrefColumn] !== "undefined" ? currentRow[field.IsURLHrefColumn] : currentRow[field.DatabaseColumn]} target="_blank">
                                                                                               {getURLText(currentRow, field)}
                                                                                          </a>
                                                                                     </div>
                                                                                }

                                                                                {typeof field.IsURLButton !== "undefined" &&
                                                                                     <>
                                                                                          {currentRow[field.IsURLHrefColumn] !== null &&
                                                                                               <button className={`${styles.SegiTableButtonStyle} ${styles.SegiTableURLButton}`} onClick={() => window.open(typeof currentRow[field.IsURLHrefColumn] !== "undefined" ? currentRow[field.IsURLHrefColumn] : currentRow[field.DatabaseColumn], '_blank')}>
                                                                                                    {getURLText(currentRow, field)}
                                                                                               </button>
                                                                                          }

                                                                                          {currentRow[field.IsURLHrefColumn] === null &&
                                                                                               <div>{currentRow[field.DatabaseColumn]}</div>
                                                                                          }
                                                                                     </>
                                                                                }
                                                                           </>
                                                                      }

                                                                      {field.IsEmailAddress &&
                                                                           <div><a href={`mailto:${currentRow[field.DatabaseColumn]}`} target="_blank">{currentRow[field.DatabaseColumn]}</a></div>
                                                                      }
                                                                 </>
                                                            }

                                                            {field.FieldType === FieldTypes.SELECT && typeof currentRow[field.SelectDataIDColumn] !== "undefined" && currentRow[field.SelectDataIDColumn] !== -1 &&
                                                                 <>
                                                                      {field.SelectData?.filter((currentItem) => (String(currentItem[field.SelectDataIDColumn]) === String(currentRow[field.SelectDataIDColumn]))).length === 1 &&
                                                                           <div>{field.SelectData?.filter((currentItem) => (String(currentItem[field.SelectDataIDColumn]) === String(currentRow[field.SelectDataIDColumn])))[0][field.SelectDataValueColumn]}</div>
                                                                      }
                                                                 </>
                                                            }

                                                            {field.FieldType === FieldTypes.CHECKBOX &&
                                                                 <input type="checkbox" className={styles.SegiTableInputStyle} disabled={true} checked={currentRow[field.DatabaseColumn]} />
                                                            }
                                                       </td>
                                                  )
                                             })
                                        }
                                   </tr>

                                   {((expandedId === String(currentRow[currentTableComponent.ExpandableDataColumn]))) && expandableContent !== null &&
                                        <tr>
                                             <td className={styles.SegiTableExpandableRowContent} colSpan={currentTableComponent.Fields?.length}>
                                                  <div className={`${styles.SegiTableExpandableContent}`}>
                                                       {typeof expandableContent === "string" &&
                                                            <div dangerouslySetInnerHTML={{ __html: expandableContent }}></div>
                                                       }

                                                       {typeof expandableContent === "object" &&
                                                            <>
                                                                 {expandableContent}
                                                            </>
                                                       }

                                                       {/*{typeof expandableContent !== "string" && typeof expandableContent !== "object" &&
                                                            <div>Default content</div>
                                                       }*/}
                                                  </div>
                                             </td>
                                        </tr>
                                   }
                              </React.Fragment >
                         )
                    })
               }
          </>
     )
}

type SegiTableDataGridBodyEditableFieldsProps = {
     currentTableComponent: ITableComponent;
     darkMode: boolean;
     editFieldChangeHandler: (currentRow: any, fieldName: string, fieldValue: string | number | Date | boolean) => void;
     filteredTableData: any;
     getFormattedDate: (dateStr: string, separator: string, format?: string) => string;
     getURLText: (currentRow: [], field: any) => string;
     isVisible: (field: ITableComponentField) => void;
}

const SegiTableDataGridBodyEditableFields = ({ currentTableComponent, darkMode, editFieldChangeHandler, filteredTableData, getFormattedDate, getURLText, isVisible }: SegiTableDataGridBodyEditableFieldsProps) => {
     return (
          <>
               {filteredTableData && filteredTableData
                    .map((currentRow: any, index: number) => {
                         {
                              return (
                                   <tr key={index} className={`${!darkMode ? `lightMode` : `darkMode`}`}>
                                        {currentTableComponent.Fields
                                             .filter((field: ITableComponentField) => {
                                                  return isVisible(field)
                                             })
                                             .map((field: ITableComponentField, index: number) => {
                                                  return (
                                                       <td key={index} className={`${styles.SegiTableDataCell} ${field.IsIDColumn ? `${styles.SegiTableIDColumn}` : ""} ${!darkMode ? "lightMode" : "darkMode"}`}>
                                                            {/* Fields that are disabled from editing */}
                                                            {field.Disabled === true &&
                                                                 <>
                                                                      {field.FieldType === FieldTypes.TEXTFIELD &&
                                                                           <>
                                                                                {!field.IsURL &&
                                                                                     <div>{currentRow[field.DatabaseColumn]}</div>
                                                                                }

                                                                                {field.IsURL &&
                                                                                     <>
                                                                                          {typeof field.IsURLButton === "undefined" &&
                                                                                               <div>
                                                                                                    <a href={typeof currentRow[field.IsURLHrefColumn] !== "undefined" ? currentRow[field.IsURLHrefColumn] : currentRow[field.DatabaseColumn]} target="_blank">
                                                                                                         {getURLText(currentRow, field)}
                                                                                                    </a>
                                                                                               </div>
                                                                                          }
                                                                                     </>
                                                                                }
                                                                           </>
                                                                      }

                                                                      {field.FieldType === FieldTypes.SELECT &&
                                                                           field.SelectData?.filter((currentItem: any) => { return currentItem[field.SelectDataIDColumn] === currentRow[field.SelectDataIDColumn] }).length > 0 &&
                                                                           <>
                                                                                {field.SelectData?.filter((currentItem) => { return currentItem[field.SelectDataIDColumn] === currentRow[field.SelectDataIDColumn] })[0][field.SelectDataValueColumn]}
                                                                           </>
                                                                      }
                                                                 </>
                                                            }

                                                            {/* Editable fields */}
                                                            {field.Disabled !== true &&
                                                                 <>
                                                                      {/* Editable textfield */}
                                                                      {field.FieldType === FieldTypes.TEXTFIELD &&
                                                                           <>
                                                                                {field.FieldValueType !== FieldValueTypes.DATE &&
                                                                                     <input className={`${styles.SegiTableInputStyle} ${styles.SegiTableInputStyleFullWidth}`} value={typeof currentRow[field.DatabaseColumn] !== "undefined" && currentRow[field.DatabaseColumn] !== null ? currentRow[field.DatabaseColumn] : ""} required={field.Required === true ? true : false} onChange={(event) => editFieldChangeHandler(currentRow, field.DatabaseColumn, event.target.value)}></input>
                                                                                }

                                                                                {field.FieldValueType === FieldValueTypes.DATE &&
                                                                                     <input type="date" className={`${styles.SegiTableInputStyle} ${styles.SegiTableInputStyleFullWidth}`} value={typeof currentRow[field.DatabaseColumn] !== "undefined" && currentRow[field.DatabaseColumn] !== null ? getFormattedDate(currentRow[field.DatabaseColumn], "-") : ""} required={field.Required === true ? true : false} onChange={(event) => editFieldChangeHandler(currentRow, field.DatabaseColumn, event.target.value)}></input>
                                                                                }
                                                                           </>
                                                                      }

                                                                      {/* Editable textarea */}
                                                                      {field.FieldType === FieldTypes.TEXTAREA &&
                                                                           <>
                                                                                <textarea rows={typeof field.Rows !== "undefined" ? field.Rows : 10} cols={typeof field.Columns !== "undefined" ? field.Columns : 10} className={`${styles.SegiTableInputStyle} ${styles.SegiTableInputStyleFullWidth}`} value={typeof currentRow[field.DatabaseColumn] !== "undefined" && currentRow[field.DatabaseColumn] !== null ? currentRow[field.DatabaseColumn] : ""} required={field.Required === true ? true : false} onChange={(event) => editFieldChangeHandler(currentRow, field.DatabaseColumn, event.target.value)} />
                                                                           </>
                                                                      }

                                                                      {/* Editable select */}
                                                                      {field.FieldType === FieldTypes.SELECT &&
                                                                           <select className={`${styles.SegiTableSolidBorder} ${styles.SegiTableSelectStyle}`} value={typeof currentRow[field.DatabaseColumn] !== "undefined" && currentRow[field.DatabaseColumn] !== null ? currentRow[field.DatabaseColumn] : ""} required={field.Required === true ? true : false} onChange={(event) => editFieldChangeHandler(currentRow, field.DatabaseColumn, event.target.value)}>
                                                                                <option value="-1">Please select</option>

                                                                                {field.SelectData?.filter((currentItem) => (field.SelectDataEnabledOnly !== true || (field.SelectDataEnabledOnly === true && currentItem[field.SelectDataEnabledOnlyColumn] === true)))
                                                                                     .map((currentItem, index: number) => {
                                                                                          return <option key={index} value={currentItem[field.SelectDataIDColumn]}>{`${currentItem[field.SelectDataValueColumn]}`}</option>
                                                                                     })}
                                                                           </select>
                                                                      }

                                                                      {/* Editable checkbox */}
                                                                      {field.FieldType === FieldTypes.CHECKBOX &&
                                                                           <input className={styles.SegiTableInputStyle} type="checkbox" checked={currentRow[field.DatabaseColumn]} onChange={(event) => editFieldChangeHandler(currentRow, field.DatabaseColumn, event.target.checked)} />
                                                                      }
                                                                 </>
                                                            }
                                                       </td>
                                                  )
                                             })}
                                   </tr>
                              )
                         }
                    })
               }
          </>
     )
}

type SegiTablePaginationProps = {
     currentPage: number;
     darkMode: boolean;
     lastPage: boolean;
     lastPageNum: number;
     mergedPageSizes: Record<number, string>;
     pageClickHandler: (adjustValue?: number, absoluteValue?: number) => void;
     pageRecordStartEndLabel: string;
     pageSize: number;
     pageSizeClickHandler: (value: number) => void;
}

const SegiTablePagination = ({ currentPage, darkMode, lastPage, lastPageNum, mergedPageSizes, pageClickHandler, pageSize, pageRecordStartEndLabel, pageSizeClickHandler }: SegiTablePaginationProps) => {
     return (
          <span id="SegiTablePagination" className={`${styles.SegiTablePagination} ${darkMode ? "darkMode" : ""}`}>
               <span className={`${styles.SegiTablePaginationSpan}`}>
                    <span className={`${styles.SegiTableRowLabel}`}>Rows per page:</span>

                    <span style={{ paddingTop: "12px", paddingRight: lastPageNum === 1 ? "25px" : "" }}>
                         <select id="pageSize" className={`${styles.SegiTableSolidBorder} ${styles.SegiTableSelectStyle}`} value={pageSize} onChange={(event) => pageSizeClickHandler(parseInt(event.target.value, 10))}>
                              {Object.keys(mergedPageSizes).map((pageSize: any, index: number) => {
                                   return <option key={index} value={pageSize}>{mergedPageSizes[pageSize]}</option>
                              })}
                         </select>
                    </span>

                    <span className={`${styles.SegiTableRecordStartEnd} ${pageSize === 0 ? `${styles.SegiTableRecordStartEndAll}` : ""}`}>{pageRecordStartEndLabel}</span>

                    {lastPageNum !== 1 &&
                         <>
                              <span className={`${styles.SegiTableRowCurrentPage}`}>
                                   Page {currentPage}/{lastPageNum}
                              </span>

                              <div className={`${styles.SegiTablePaginationContainer}`}>
                                   <div>
                                        <span className={`${styles.SegiTablePaginationNavContainer}`}>
                                             <button
                                                  className={`${currentPage > 1 ? `${styles.SegiTablePaginationIconButton}` : `${styles.SegiTablePaginationIconButtonDisabled}`}`}
                                                  onClick={() => currentPage > 1 ? pageClickHandler(null, 1) : null}
                                                  disabled={currentPage === 1}
                                             >
                                                  |<div style={{ display: "inline", position: "relative", top: "2px" }}>&lt;</div>
                                             </button>
                                             <button
                                                  className={`${currentPage > 1 ? `${styles.SegiTablePaginationIconButton}` : `${styles.SegiTablePaginationIconButtonDisabled}`}`}
                                                  onClick={() => currentPage > 1 ? pageClickHandler(-1) : null}
                                             >
                                                  <div style={{ display: "inline", position: "relative", top: "2px" }}>&lt;</div>
                                             </button>

                                             <button
                                                  className={`${lastPageNum != 1 && !lastPage ? `${styles.SegiTablePaginationIconButton}` : `${styles.SegiTablePaginationIconButtonDisabled}`}`}
                                                  onClick={() => lastPageNum != 1 && !lastPage ? pageClickHandler(1) : null}
                                             >
                                                  <div style={{ display: "inline", position: "relative", top: "2px" }}>&gt;</div>
                                             </button>
                                             <button
                                                  className={`${lastPageNum != 1 && !lastPage ? `${styles.SegiTablePaginationIconButton}` : `${styles.SegiTablePaginationIconButtonDisabled}`}`}
                                                  onClick={() => lastPageNum > 1 && !lastPage ? pageClickHandler(null, -1) : null}
                                             >
                                                  <div style={{ display: "inline", position: "relative", top: "2px", maxWidth: "5px" }}>&gt;</div><span style={{ display: "inline", position: "relative", top: "1px", left: "2px", maxWidth: "5px" }}>|</span>
                                             </button>
                                        </span>
                                   </div>
                              </div>
                         </>
                    }
               </span>
          </span>
     )
}