(self["webpackChunkwatchlist"] = self["webpackChunkwatchlist"] || []).push([["src_app_watchlist-items_watchlist-items_module_ts"],{

/***/ 4351:
/*!*******************************************************************!*\
  !*** ./src/app/watchlist-items/watchlist-items-routing.module.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchListItemsPageRoutingModule": () => (/* binding */ WatchListItemsPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 1855);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2741);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9535);
/* harmony import */ var _watchlist_items_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watchlist-items.page */ 686);




const routes = [
    {
        path: '',
        component: _watchlist_items_page__WEBPACK_IMPORTED_MODULE_0__.WatchListItemsPage,
    }
];
let WatchListItemsPageRoutingModule = class WatchListItemsPageRoutingModule {
};
WatchListItemsPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    })
], WatchListItemsPageRoutingModule);



/***/ }),

/***/ 3376:
/*!***********************************************************!*\
  !*** ./src/app/watchlist-items/watchlist-items.module.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchListItemsPageModule": () => (/* binding */ WatchListItemsPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 1855);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 4595);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2741);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6274);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 3324);
/* harmony import */ var _watchlist_items_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watchlist-items.page */ 686);
/* harmony import */ var _watchlist_items_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./watchlist-items-routing.module */ 4351);


//import { RouterModule } from '@angular/router';





let WatchListItemsPageModule = class WatchListItemsPageModule {
    constructor() { }
    handleError(response, error) {
    }
};
WatchListItemsPageModule.ctorParameters = () => [];
WatchListItemsPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonicModule,
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _watchlist_items_routing_module__WEBPACK_IMPORTED_MODULE_1__.WatchListItemsPageRoutingModule
        ],
        declarations: [_watchlist_items_page__WEBPACK_IMPORTED_MODULE_0__.WatchListItemsPage]
    })
], WatchListItemsPageModule);



/***/ }),

/***/ 686:
/*!*********************************************************!*\
  !*** ./src/app/watchlist-items/watchlist-items.page.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchListItemsPage": () => (/* binding */ WatchListItemsPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 1855);
/* harmony import */ var _raw_loader_watchlist_items_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./watchlist-items.page.html */ 8661);
/* harmony import */ var _watchlist_items_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./watchlist-items.page.scss */ 3322);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2741);
/* harmony import */ var _core_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/data.service */ 1113);





let WatchListItemsPage = class WatchListItemsPage {
    constructor(dataService) {
        this.dataService = dataService;
        this.addItemName = '';
        this.addItemIMDBURL = '';
        this.addItemType = '';
        this.isAdding = false;
        this.isEditing = false;
        this.sortColumn = 'Name';
        this.sortDirection = 'DESC';
        this.sortActiveColumn = 'Name';
    }
    addWatchListItem() {
        this.isAdding = true;
    }
    cancelAddWatchListItem() {
        this.addItemName = '';
        this.addItemIMDBURL = '';
        this.addItemType = '';
        this.isAdding = false;
    }
    cancelEditWatchListItem(currWatchListItem) {
        currWatchListItem["WatchListItemID"] = currWatchListItem[`Previous`].WatchListItemID;
        currWatchListItem["WatchListTypeID"] = currWatchListItem[`Previous`].WatchListTypeID;
        currWatchListItem["IMDB_URL"] = currWatchListItem[`Previous`].IMDB_URL;
        currWatchListItem[`Disabled`] = true;
        this.isEditing = false;
    }
    doRefresh(event) {
        setTimeout(() => {
            this.dataService.getWatchListItems(this.sortColumn, this.sortDirection).subscribe((response) => {
                if (response != null)
                    for (let i = 0; i < response.length; i++)
                        response[i].Disabled = true;
                this.dataService.watchListItems = response;
                event.target.complete();
            }, error => {
            });
        }, 2000);
    }
    editWatchListItem(currWatchListItem) {
        currWatchListItem[`Previous`] = [];
        Object.assign(currWatchListItem[`Previous`], currWatchListItem);
        currWatchListItem[`Disabled`] = false;
        this.isEditing = true;
    }
    handleError(response, error) { }
    saveNewWatchListItem() {
        if (this.addItemName === ``) {
            alert(`Please select the name`);
            return;
        }
        for (let i = 0; i < this.dataService.watchListItems.length; i++) {
            if (this.dataService.watchListItems[i]['WatchListItemName'] === this.addItemName) {
                alert("This name already exists");
                return;
            }
        }
        if (this.addItemType === ``) {
            alert(`Please select the type of media`);
            return;
        }
        const currWatchListItem = [];
        currWatchListItem.Name = this.addItemName;
        currWatchListItem.Type = this.addItemType;
        currWatchListItem.IMDB_URL = this.addItemIMDBURL;
        this.dataService.addWatchListItem(currWatchListItem).subscribe((response) => {
            this.dataService.getWatchListSubscription(this.sortColumn, this.sortDirection);
        }, error => {
            this.handleError(null, error);
        });
        this.addItemName = '';
        this.addItemType = '';
        this.addItemIMDBURL = '';
    }
    saveWatchListItem(currWatchListItem) {
        if (currWatchListItem["WatchListItemID"] === null) {
            alert("Please provide the ID of the item to update");
            return;
        }
        if (currWatchListItem["WatchListItemName"] === null) {
            alert("Please enter the name of the item");
            return;
        }
        if (currWatchListItem["WatchListTypeID"] === null) {
            alert("Please enter the type");
            return;
        }
        this.dataService.updateWatchListItem(currWatchListItem).subscribe((response) => {
        }, error => {
            this.handleError(null, error);
        });
        currWatchListItem[`Disabled`] = true;
        this.isEditing = false;
    }
    searchFilter() {
        this.dataService.getWatchListSubscription(this.sortColumn, this.sortDirection);
    }
    sortClick(name, direction) {
        const columnName = (name != null ? name : this.sortColumn);
        const columnDirection = (direction != null ? direction : this.sortDirection);
        this.dataService.getWatchListItemsSubscription(columnName, columnDirection);
        this.sortActiveColumn = columnName;
        if (direction === "ASC")
            this.sortDirection = "DESC";
        else
            this.sortDirection = "ASC";
    }
    // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
    trackByFn(index, item) {
        return index; // or item.id
    }
};
WatchListItemsPage.ctorParameters = () => [
    { type: _core_data_service__WEBPACK_IMPORTED_MODULE_2__.DataService }
];
WatchListItemsPage = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
        selector: 'app-watchlist',
        template: _raw_loader_watchlist_items_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_watchlist_items_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], WatchListItemsPage);



/***/ }),

/***/ 3322:
/*!***********************************************************!*\
  !*** ./src/app/watchlist-items/watchlist-items.page.scss ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".ion-list-parent {\n  width: 100%;\n  overflow: auto;\n}\n\nion-card {\n  display: inherit;\n  width: 100%;\n}\n\nion-content {\n  overflow: auto;\n}\n\nion-icon {\n  width: 24px;\n  height: 24px;\n}\n\nion-icon.cancelButton {\n  margin-left: 10px;\n}\n\nion-input {\n  border-style: dashed;\n  border-width: 1px;\n}\n\nion-label {\n  margin-top: 10px;\n}\n\nion-list.md.list-md {\n  min-width: 1000px;\n  max-height: 500px;\n  overflow: auto;\n}\n\nion-select {\n  max-width: 100%;\n}\n\nion-col.IDColumn {\n  display: inline-flex;\n  max-width: 105px !important;\n}\n\nion-col.nameLabelColumn {\n  display: inline-flex;\n}\n\nion-col.nameLabelMobileColumn {\n  display: inline-flex;\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.nameDataMobileColumn {\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.typeLabelColumn {\n  display: inline-flex;\n  padding-left: 20px;\n}\n\nion-col.typeLabelMobileColumn {\n  display: inline-flex;\n  padding-left: 20px;\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.typeDataMobileColumn {\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.IMDBURLLabelColumn {\n  display: inline-flex;\n}\n\nion-col.IMDBURLLabelMobileColumn {\n  display: inline-flex;\n}\n\nion-grid > ion-row > ion-col > ion-icon.IDArrowIcon,\nion-grid > ion-row > ion-col > ion-icon.NameArrowIcon,\nion-grid > ion-row > ion-col > ion-icon.TypeArrowIcon,\nion-grid > ion-row > ion-col > ion-icon.IMDBURLArrowIcon {\n  width: 50px;\n  position: relative;\n  vertical-align: bottom;\n  padding-top: 10px;\n}\n\nion-grid > ion-row > ion-col > ion-label.NameLabel {\n  max-width: 75px;\n}\n\nion-grid > ion-row > ion-col > ion-icon {\n  width: 70%;\n  height: 70%;\n}\n\nion-grid > ion-row > ion-col > ion-icon.active {\n  color: #30A199;\n}\n\n.actionColumn {\n  display: inline-flex;\n  min-width: 175px !important;\n}\n\n.actionColumn > ion-icon.saveItem {\n  margin-left: 25px;\n}\n\n.optionsPanel {\n  float: left;\n  min-width: 750px;\n  display: flex;\n}\n\n#searchBar {\n  min-width: 437.5px;\n}\n\n#mobileToggle {\n  border-style: none !important;\n  border-width: 0px !important;\n}\n\n.saveNewWatchList {\n  width: 111px;\n  padding-left: 50px;\n}\n\n.addColumn {\n  max-width: 62px !important;\n  top: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdGNobGlzdC1pdGVtcy5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxXQUFBO0VBQ0EsY0FBQTtBQUNKOztBQUVBO0VBQ0ksZ0JBQUE7RUFDQSxXQUFBO0FBQ0o7O0FBRUE7RUFDSSxjQUFBO0FBQ0o7O0FBRUE7RUFDSSxXQUFBO0VBQ0EsWUFBQTtBQUNKOztBQUVBO0VBQ0ksaUJBQUE7QUFDSjs7QUFFQTtFQUNJLG9CQUFBO0VBQ0EsaUJBQUE7QUFDSjs7QUFFQTtFQUNJLGdCQUFBO0FBQ0o7O0FBRUE7RUFDSSxpQkFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtBQUNKOztBQUVBO0VBQ0ksZUFBQTtBQUNKOztBQUVBO0VBQ0ksb0JBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0ksb0JBQUE7QUFDSjs7QUFFQTtFQUNHLG9CQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtBQUNIOztBQUVBO0VBQ0csdUJBQUE7RUFDQSwyQkFBQTtBQUNIOztBQUVBO0VBQ0csb0JBQUE7RUFDQSxrQkFBQTtBQUNIOztBQUVBO0VBQ0csb0JBQUE7RUFDQSxrQkFBQTtFQUNBLHVCQUFBO0VBQ0EsMkJBQUE7QUFDSDs7QUFFQTtFQUNJLHVCQUFBO0VBQ0EsMkJBQUE7QUFDSjs7QUFFQTtFQUNJLG9CQUFBO0FBQ0o7O0FBRUE7RUFDSSxvQkFBQTtBQUNKOztBQUVBOzs7O0VBSUssV0FBQTtFQUNBLGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSxpQkFBQTtBQUNMOztBQUVDO0VBQ0csZUFBQTtBQUNKOztBQUVBO0VBQ0ksVUFBQTtFQUNBLFdBQUE7QUFDSjs7QUFFQTtFQUNJLGNBQUE7QUFDSjs7QUFFQTtFQUNJLG9CQUFBO0VBQ0EsMkJBQUE7QUFDSjs7QUFFQTtFQUNJLGlCQUFBO0FBQ0o7O0FBRUE7RUFDSSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0FBQ0o7O0FBRUE7RUFDSSxrQkFBQTtBQUNKOztBQUVBO0VBQ0ksNkJBQUE7RUFDQSw0QkFBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtFQUNBLGtCQUFBO0FBQ0o7O0FBRUE7RUFDSSwwQkFBQTtFQUNBLFNBQUE7QUFDSiIsImZpbGUiOiJ3YXRjaGxpc3QtaXRlbXMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmlvbi1saXN0LXBhcmVudCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbmlvbi1jYXJkIHtcbiAgICBkaXNwbGF5OiBpbmhlcml0O1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG5pb24tY29udGVudCB7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbmlvbi1pY29uIHtcbiAgICB3aWR0aDogMjRweDtcbiAgICBoZWlnaHQ6IDI0cHg7XG59XG5cbmlvbi1pY29uLmNhbmNlbEJ1dHRvbiB7XG4gICAgbWFyZ2luLWxlZnQ6IDEwcHg7XG59XG5cbmlvbi1pbnB1dCB7XG4gICAgYm9yZGVyLXN0eWxlOiBkYXNoZWQ7XG4gICAgYm9yZGVyLXdpZHRoOiAxcHg7XG59XG5cbmlvbi1sYWJlbCB7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbn1cblxuaW9uLWxpc3QubWQubGlzdC1tZCB7XG4gICAgbWluLXdpZHRoOiAxMDAwcHg7XG4gICAgbWF4LWhlaWdodDogNTAwcHg7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbmlvbi1zZWxlY3Qge1xuICAgIG1heC13aWR0aDogMTAwJTtcbn1cblxuaW9uLWNvbC5JRENvbHVtbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgbWF4LXdpZHRoOjEwNXB4ICFpbXBvcnRhbnQ7XG59XG5cbmlvbi1jb2wubmFtZUxhYmVsQ29sdW1uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbn1cblxuaW9uLWNvbC5uYW1lTGFiZWxNb2JpbGVDb2x1bW4ge1xuICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICB3aWR0aDogMjAwcHggIWltcG9ydGFudDtcbiAgIG1heC13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbn1cblxuaW9uLWNvbC5uYW1lRGF0YU1vYmlsZUNvbHVtbiB7XG4gICB3aWR0aDogMjAwcHggIWltcG9ydGFudDtcbiAgIG1heC13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbn1cblxuaW9uLWNvbC50eXBlTGFiZWxDb2x1bW4ge1xuICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG59XG5cbmlvbi1jb2wudHlwZUxhYmVsTW9iaWxlQ29sdW1uIHtcbiAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgcGFkZGluZy1sZWZ0OiAyMHB4O1xuICAgd2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG4gICBtYXgtd2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG59XG5cbmlvbi1jb2wudHlwZURhdGFNb2JpbGVDb2x1bW4ge1xuICAgIHdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xuICAgIG1heC13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbn1cblxuaW9uLWNvbC5JTURCVVJMTGFiZWxDb2x1bW4ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xufVxuXG5pb24tY29sLklNREJVUkxMYWJlbE1vYmlsZUNvbHVtbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG59XG5cbmlvbi1ncmlkID4gaW9uLXJvdyA+IGlvbi1jb2wgPiBpb24taWNvbi5JREFycm93SWNvbiwgXG5pb24tZ3JpZCA+IGlvbi1yb3cgPiBpb24tY29sID4gaW9uLWljb24uTmFtZUFycm93SWNvbixcbmlvbi1ncmlkID4gaW9uLXJvdyA+IGlvbi1jb2wgPiBpb24taWNvbi5UeXBlQXJyb3dJY29uLFxuaW9uLWdyaWQgPiBpb24tcm93ID4gaW9uLWNvbCA+IGlvbi1pY29uLklNREJVUkxBcnJvd0ljb24ge1xuICAgICB3aWR0aDogNTBweDtcbiAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xuICAgICBwYWRkaW5nLXRvcDogMTBweDtcbiB9XG5cbiBpb24tZ3JpZCA+IGlvbi1yb3cgPiBpb24tY29sID4gaW9uLWxhYmVsLk5hbWVMYWJlbCB7XG4gICAgbWF4LXdpZHRoOiA3NXB4O1xufVxuXG5pb24tZ3JpZCA+IGlvbi1yb3cgPiBpb24tY29sID4gaW9uLWljb24ge1xuICAgIHdpZHRoOiA3MCU7XG4gICAgaGVpZ2h0OiA3MCU7XG59XG5cbmlvbi1ncmlkID4gaW9uLXJvdyA+IGlvbi1jb2wgPiBpb24taWNvbi5hY3RpdmUge1xuICAgIGNvbG9yOiAjMzBBMTk5O1xufVxuXG4uYWN0aW9uQ29sdW1uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBtaW4td2lkdGg6IDE3NXB4ICFpbXBvcnRhbnQ7XG59XG5cbi5hY3Rpb25Db2x1bW4gPiBpb24taWNvbi5zYXZlSXRlbSB7XG4gICAgbWFyZ2luLWxlZnQ6IDI1cHg7XG59XG5cbi5vcHRpb25zUGFuZWwge1xuICAgIGZsb2F0OiBsZWZ0O1xuICAgIG1pbi13aWR0aDogNzUwcHg7XG4gICAgZGlzcGxheTogZmxleDtcbn1cblxuI3NlYXJjaEJhciB7XG4gICAgbWluLXdpZHRoOiA0MzcuNXB4O1xufVxuXG4jbW9iaWxlVG9nZ2xlIHtcbiAgICBib3JkZXItc3R5bGU6IG5vbmUgIWltcG9ydGFudDtcbiAgICBib3JkZXItd2lkdGg6IDBweCAhaW1wb3J0YW50OyAgICBcbn1cblxuLnNhdmVOZXdXYXRjaExpc3Qge1xuICAgIHdpZHRoOiAxMTFweDtcbiAgICBwYWRkaW5nLWxlZnQ6IDUwcHg7XG59XG5cbi5hZGRDb2x1bW4ge1xuICAgIG1heC13aWR0aDogNjJweCAhaW1wb3J0YW50O1xuICAgIHRvcDogMTBweDtcbn0iXX0= */");

/***/ }),

/***/ 8661:
/*!*************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/watchlist-items/watchlist-items.page.html ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header [translucent]=\"true\">\n     <ion-toolbar>\n          <ion-title>WatchList Items</ion-title>\n     </ion-toolbar>\n</ion-header>\n\n<ion-content>\n     <ion-refresher slot=\"fixed\" (ionRefresh)=\"doRefresh($event)\">\n          <ion-refresher-content></ion-refresher-content>\n     </ion-refresher>\n     \n     <ion-grid>\n          <ion-row class=\"optionsPanel\">\n               <ion-col size=\"2\" class=\"addColumn\">\n                    <ion-icon *ngIf=\"!isAdding && !isEditing\" class=\"addWatchList\" name=\"add-outline\" (click)=\"addWatchListItem()\"></ion-icon>\n               </ion-col>\n\n               <ion-col size=\"5\" id=\"searchBar\">\n                    <ion-searchbar (ionChange)=\"searchFilter()\" [disabled]=\"isAdding || isEditing\" [(ngModel)]=\"dataService.searchTerm\" (ionDdisabled)=\"isAdding || isEditing\"></ion-searchbar>\n               </ion-col>\n\n               <ion-col size=\"4\" id=\"mobileToggle\">\n                    <ion-item>Mobile<ion-toggle [(ngModel)]=\"dataService.isMobilePlatform\" color=\"primary\"></ion-toggle></ion-item>\n               </ion-col>\n          </ion-row>\n     </ion-grid>\n      \n     <div class=\"ion-list-parent\">\n          <ion-list>\n               <ion-item> <!-- Table headers -->\n                    <ion-grid>\n                         <ion-row>\n                              <ion-col size=\"2\" class=\"IDColumn\">\n                                   <ion-label>ID</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'ID' ? 'upArrow IDArrowIcon active' : 'upArrow IDArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('ID','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'ID' ? 'downArrow IDArrowIcon active' : 'downArrow IDArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('ID','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameLabelMobileColumn' : 'nameLabelColumn'\">\n                                   <ion-label class=\"NameLabel\">Name</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'Name' ? 'upArrow NameArrowIcon active' : 'upArrow NameArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('Name','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'Name' ? 'downArrow NameArrowIcon active' : 'downArrow NameArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('Name','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'typeLabelMobileColumn' : 'typeLabelColumn'\">\n                                   <ion-label>Type</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'Type' ? 'upArrow TypeArrowIcon active' : 'upArrow TypeArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('Type','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'Type' ? 'downArrow TypeArrowIcon active' : 'downArrow TypeArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('Type','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"3\" [ngClass]=\"dataService.isMobilePlatform == true ? 'IMDBURLLabelMobileColumn' : 'IMDBURLLabelColumn'\">\n                                   <ion-label>IMDB URL</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'IMDB_URL' ? 'upArrow IMDBURLArrowIcon active' : 'upArrow IMDBURLArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('IMDB_URL','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'IMDB_URL' ? 'downArrow IMDBURLArrowIcon active' : 'downArrow IMDBURLArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('IMDB_URL','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"1\">\n                                   <ion-label></ion-label>\n                              </ion-col>\n                         </ion-row>\n                    </ion-grid>               \n               </ion-item>\n\n               <ion-item *ngIf=\"isAdding\">\n                    <ion-grid>\n                         <ion-row>\n                              <ion-col size=\"2\" class=\"IDColumn\"></ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameDataMobileColumn' : ''\">\n                                   <ion-input type=\"text\" [(ngModel)]=\"addItemName\" [value]=\"addItemName\" ></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'typeDataMobileColumn' : ''\">\n                                   <ion-select placeholder='Type' name=\"title\" [(ngModel)]=\"addItemType\">\n                                        <ion-select-option *ngFor=\"let currItem of dataService.watchListTypes;trackBy: trackByFn\" [value]=\"currItem.WatchListTypeID\">{{currItem.WatchListTypeName}}</ion-select-option>\n                                   </ion-select>\n                              </ion-col>\n\n                              <ion-col size=\"3\">\n                                   <ion-input type=\"text\" [(ngModel)]=\"addItemIMDBURL\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"1\" class=\"actionColumn\">\n                                   <ion-icon name=\"save-outline\" class=\"saveItem\" (click)=\"saveNewWatchListItem()\"></ion-icon>\n                                   <ion-icon name=\"close-circle-outline\" class=\"cancelButton\" (click)=\"cancelAddWatchListItem()\"></ion-icon>\n                              </ion-col>\n                         </ion-row>                    \n                    </ion-grid>\n               </ion-item>\n\n               <ion-item *ngFor=\"let currWatchListItem of dataService.watchListItems\">\n                    <ion-grid>\n                         <ion-row>\n                              <ion-col size=\"2\" class=\"IDColumn\">\n                                   <ion-label>{{ currWatchListItem.WatchListItemID }}</ion-label>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameDataMobileColumn' : ''\">\n                                   <ion-input [disabled]=\"currWatchListItem.Disabled\" type=\"text\" [(ngModel)]=\"currWatchListItem.WatchListItemName\" [value]=\"currWatchListItem.WatchListItemName\" ></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameDataMobileColumn' : ''\">\n                                   <ion-select placeholder='Type' name=\"title\" [disabled]=\"currWatchListItem.Disabled\" [(ngModel)]=\"currWatchListItem.WatchListTypeID\">\n                                        <ion-select-option *ngFor=\"let currItem of dataService.watchListTypes;trackBy: trackByFn\" [value]=\"currItem.WatchListTypeID\">{{currItem.WatchListTypeName}}</ion-select-option>\n                                   </ion-select>\n                              </ion-col>\n\n                              <ion-col size=\"3\">\n                                   <ion-input [disabled]=\"currWatchListItem.Disabled\" type=\"text\" [(ngModel)]=\"currWatchListItem.IMDB_URL\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"1\" class=\"actionColumn ion-text-start\">\n                                   <ion-icon *ngIf=\"currWatchListItem.Disabled && !isAdding && !isEditing\" name=\"create-outline\" (click)=\"editWatchListItem(currWatchListItem)\"></ion-icon>\n                                   <ion-icon *ngIf=\"!currWatchListItem.Disabled\" class=\"saveItem\" name=\"save-outline\" (click)=\"saveWatchListItem(currWatchListItem)\"></ion-icon>\n                                   <ion-icon *ngIf=\"!currWatchListItem.Disabled\" name=\"close-circle-outline\" class=\"cancelButton\" (click)=\"cancelEditWatchListItem(currWatchListItem)\"></ion-icon>\n                              </ion-col>\n                         </ion-row>                    \n                    </ion-grid>                   \n               </ion-item>\n          </ion-list>\n     </div>\n</ion-content>\n");

/***/ })

}]);
//# sourceMappingURL=src_app_watchlist-items_watchlist-items_module_ts.js.map