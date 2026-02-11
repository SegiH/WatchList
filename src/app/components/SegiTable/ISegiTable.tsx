export const FieldTypes = Object.freeze({
     TEXTFIELD: 'TEXTFIELD',
     TEXTAREA: 'TEXTAREA',
     SELECT: 'SELECT',
     CHECKBOX: 'CHECKBOX'
});

type FieldTypesType = keyof typeof FieldTypes;

export const FieldValueTypes = Object.freeze({
     TEXT: 'TEXT',
     NUMBER: 'NUMBER',
     DATE: 'DATE',
     BOOLEAN: 'BOOLEAN',
     CURRENCY: 'CURRENCY'
});

type FieldValueTypes = keyof typeof FieldValueTypes;

export interface ITableComponent {
     Data: any;
     ExpandableContent?: (row: any) => React.ReactNode;
     ExpandableData?: number[]; // Used internally by the app
     ExpandableDataColumn?: string; // TODO: Add comment and delete main one or delete this one
     ExpandableDataLinked?: boolean;
     ExpandedRows?: number[]; // Used internally by the app
     Fields: ITableComponentField[];
     MultiExpandableRows?: boolean;
     SemiTransparentTableHeader?: boolean;
     SemiTransparentTableHeaderOpacity?: number;
}

export interface ITableComponentField {
     Addable?: boolean; // Indicates whether this field is addable
     Clickable?: boolean; // Indicates whether the column header clickable
     ClickCallBack?: () => void; // Callback event to be called when you click on the column header
     Centered?: boolean; // IS the text centered
     Columns?: number; // The number of columns for a textarea
     ColumnWidth?: string; // The column width, ideally in percentage.
     DatabaseColumn: string; // The database column in the data. This will be the name of the field in the data
     DefaultAddValue?: any; // The default value when addding the field
     Disabled?: boolean; // Disable a field from being added
     DisplayName: string; // The name of the column header
     ExpandableCriteria?: [{ Match: string; Show: string }]; // An array of values that are used as a condition to determien whether the row is expandable. Set this to null to have all rows be expandable
     ExpandableCriteriaExactMatch?: boolean; // If true, the values in ExpandableCriteria ned to match exactly. If false, does a partial match
     FieldType: FieldTypesType; // The type of field based on one of the FieldTypes
     FieldValue?: string | number; // The value of the field. This is used when adding
     FieldValueType: FieldValueTypes; // The type of value (text, number, date etc) based on FieldValueTypes
     Filterable?: boolean; // Indicates whether this field is filterable
     HiddenField?: boolean; // Hide this field when not editing the table
     IsEmailAddress?: boolean; // Indicates that this is an email address field
     IsIDColumn?: boolean; // Indicates that this is an ID field
     IsEnabledColumn?: boolean; // Indicates whether this field is used to determine whether to hide or show enabled fields when showDisable is provided
     IsURL?: boolean; // Indicates that this is a URL field
     IsURLButton?: boolean; // Show the URL as a button
     IsURLDisplayTextColumn?: string; // column to display for link text instead of static text. Do not use with IsURLText. Only use one or the other
     IsURLHrefColumn ?: string; // Specify the database column name in the data that is used as the hyperlink text when displaying a URL
     IsURLText?: string; // Static text to display for the link. Do not use with IsURLColumnText. Only use one or the other
     Required?: boolean; // Indicates that this is a required field
     Rows?: number; // The number of rows for a textarea
     SelectData?: any; // When the field type is SELECT, the data used to render the select drop down
     SelectDataIDColumn?: string; // When the field type is SELECT, the database column that is returned when you select a value in the select dropdown, usually an ID column
     SelectDataValueColumn?: string; // When the field type is SELECT, the value column that is displayed in the select
     SelectDataEnabledOnly?: boolean; // When the field type is SELECT, indicates that you only want to show enabled values in the select
     SelectDataEnabledOnlyColumn?: string; // When the field type is SELECT and you only want to show enabled values in the select, the column in the select data that determines whether the data is enabled
     SearchableField?: boolean; // Indicates whether the field can be searched when search is enabled
     SemiTransparentTableColumn?: boolean; // Indicates whether the current column is transparent
     SemiTransparentTableColumnOpacity?: boolean; // If SemiTransparentTableColumn is true, the opacity. 
     SortableField?: boolean; // indicates whether the field can be sorted
     TogglesIDColumn?: boolean; // If true, when you double click on the column header for this field, it toggles the ID column     
     UniqueValues?: any[]; // Array that stores unique filter values
     UniqueValuesSelected?: any[]; // Array that stores select filter values
     UniqueValuesSelectAllSelected?: boolean; // Indicates whether select all is checked in the filter values
}