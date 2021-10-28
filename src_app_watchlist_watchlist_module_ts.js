(self["webpackChunkwatchlist"] = self["webpackChunkwatchlist"] || []).push([["src_app_watchlist_watchlist_module_ts"],{

/***/ 3073:
/*!*******************************************************!*\
  !*** ./src/app/watchlist/watchlist-routing.module.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchListPageRoutingModule": () => (/* binding */ WatchListPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 1855);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2741);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9535);
/* harmony import */ var _watchlist_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watchlist.page */ 2102);




const routes = [
    {
        path: '',
        component: _watchlist_page__WEBPACK_IMPORTED_MODULE_0__.WatchListPage,
    }
];
let WatchListPageRoutingModule = class WatchListPageRoutingModule {
};
WatchListPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    })
], WatchListPageRoutingModule);



/***/ }),

/***/ 8448:
/*!***********************************************!*\
  !*** ./src/app/watchlist/watchlist.module.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchListPageModule": () => (/* binding */ WatchListPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 1855);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 4595);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2741);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6274);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 3324);
/* harmony import */ var _watchlist_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watchlist.page */ 2102);
/* harmony import */ var _watchlist_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./watchlist-routing.module */ 3073);







let WatchListPageModule = class WatchListPageModule {
};
WatchListPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonicModule,
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _watchlist_routing_module__WEBPACK_IMPORTED_MODULE_1__.WatchListPageRoutingModule
        ],
        declarations: [_watchlist_page__WEBPACK_IMPORTED_MODULE_0__.WatchListPage]
    })
], WatchListPageModule);



/***/ }),

/***/ 2102:
/*!*********************************************!*\
  !*** ./src/app/watchlist/watchlist.page.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchListPage": () => (/* binding */ WatchListPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 1855);
/* harmony import */ var _raw_loader_watchlist_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./watchlist.page.html */ 4569);
/* harmony import */ var _watchlist_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./watchlist.page.scss */ 6436);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2741);
/* harmony import */ var _core_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/data.service */ 1113);



// Set app icon


let WatchListPage = class WatchListPage {
    constructor(dataService) {
        this.dataService = dataService;
        this.addItemName = '';
        this.addItemStartDate = '';
        this.addItemEndDate = '';
        this.addItemNotes = '';
        this.isAdding = false;
        this.isEditing = false;
        this.sortColumn = 'Name';
        this.sortDirection = 'ASC';
        this.sortActiveColumn = 'Name';
        this.dataService.title = "WatchList";
    }
    addWatchList() {
        this.isAdding = true;
    }
    cancelAddWatchList() {
        this.addItemName = '';
        this.addItemStartDate = '';
        this.addItemEndDate = '';
        this.addItemNotes = '';
        this.isAdding = false;
    }
    cancelEditWatchList(currWatchList) {
        currWatchList["WatchListItemID"] = currWatchList[`Previous`].WatchListItemID;
        currWatchList["StartDate"] = currWatchList[`Previous`].StartDate;
        currWatchList["EndDate"] = currWatchList[`Previous`].EndDate;
        currWatchList["Notes"] = currWatchList[`Previous`].Notes;
        currWatchList[`Disabled`] = true;
        this.isEditing = false;
    }
    doRefresh(event) {
        setTimeout(() => {
            this.dataService.getWatchList(this.sortColumn, this.sortDirection).subscribe((response) => {
                if (response != null)
                    for (let i = 0; i < response.length; i++)
                        response[i].Disabled = true;
                this.dataService.watchList = response;
                event.target.complete();
            }, error => {
            });
        }, 2000);
    }
    editWatchList(currWatchList) {
        currWatchList[`Previous`] = [];
        Object.assign(currWatchList[`Previous`], currWatchList);
        currWatchList[`Disabled`] = false;
        this.isEditing = true;
    }
    handleError(response, error) { }
    saveNewWatchList() {
        if (this.addItemName === ``) {
            alert(`Please select the name`);
            return;
        }
        if (this.addItemStartDate === ``) {
            alert(`Please enter the start date`);
            return;
        }
        const currWatchList = [];
        currWatchList.WatchListItemID = this.addItemName;
        currWatchList.StartDate = this.addItemStartDate;
        currWatchList.EndDate = this.addItemEndDate;
        currWatchList.Notes = this.addItemNotes;
        this.dataService.addWatchList(currWatchList).subscribe((response) => {
            this.dataService.getWatchListSubscription(this.sortColumn, this.sortDirection);
        }, error => {
            this.handleError(null, error);
        });
        this.addItemName = '';
        this.addItemStartDate = '';
        this.addItemEndDate = '';
        this.addItemNotes = '';
        this.isAdding = false;
    }
    saveWatchList(currWatchList) {
        if (currWatchList[`WatchListID`] === ``) {
            alert(`Please select the name`);
            return;
        }
        if (currWatchList[`StartDate`] === ``) {
            alert(`Please enter the start date`);
            return;
        }
        this.dataService.updateWatchList(currWatchList).subscribe((response) => {
            this.dataService.getWatchListSubscription(this.sortColumn, this.sortDirection);
        }, error => {
            this.handleError(null, error);
        });
        currWatchList[`Disabled`] = true;
        this.isEditing = false;
    }
    searchFilter() {
        this.dataService.getWatchListSubscription(this.sortColumn, this.sortDirection);
    }
    sortClick(name, direction) {
        const columnName = (name != null ? name : this.sortColumn);
        const columnDirection = (direction != null ? direction : this.sortDirection);
        this.dataService.getWatchListSubscription(columnName, columnDirection);
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
WatchListPage.ctorParameters = () => [
    { type: _core_data_service__WEBPACK_IMPORTED_MODULE_2__.DataService }
];
WatchListPage = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
        selector: 'app-watchlist',
        template: _raw_loader_watchlist_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_watchlist_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], WatchListPage);



/***/ }),

/***/ 6436:
/*!***********************************************!*\
  !*** ./src/app/watchlist/watchlist.page.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".ion-list-parent {\n  width: 100%;\n  overflow: auto;\n}\n\nion-card {\n  display: flex;\n  width: 100%;\n}\n\nion-icon {\n  width: 24px;\n  height: 24px;\n}\n\nion-icon.cancelButton {\n  margin-left: 10px;\n}\n\nion-input {\n  border-style: dashed;\n  border-width: 1px;\n}\n\nion-label {\n  margin-top: 10px;\n}\n\nion-label.mobile {\n  position: relative;\n  left: 15px;\n  top: 3px;\n}\n\nion-list.md.list-md {\n  min-width: 1000px;\n  max-height: 500px;\n  overflow: auto;\n}\n\nion-select {\n  border-style: dashed;\n  border-width: 1px;\n  max-width: 100%;\n}\n\nion-col.IDColumn {\n  display: inline-flex;\n  max-width: 105px !important;\n}\n\nion-col.nameLabelColumn {\n  display: inline-flex;\n  max-width: 50px;\n}\n\nion-col.nameLabelMobileColumn {\n  display: inline-flex;\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.nameDataMobileColumn {\n  display: inline-flex;\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.dateLabelColumn {\n  display: inline-flex;\n}\n\nion-col.dateLabelMobileColumn {\n  display: inline-flex;\n  width: 144px !important;\n  max-width: 144px !important;\n}\n\nion-col.dateDataMobileColumn {\n  width: 144px !important;\n  max-width: 144px !important;\n}\n\nion-col.dateDataMobileColumnAdd {\n  width: 144px !important;\n  max-width: 144px !important;\n}\n\nion-col.notesLabelMobileColumn {\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-col.notesDataMobileColumn {\n  width: 200px !important;\n  max-width: 200px !important;\n}\n\nion-grid > ion-row > ion-col > ion-icon {\n  width: 70%;\n  height: 70%;\n}\n\nion-grid > ion-row > ion-col > ion-label.startDateLabel {\n  max-width: 75px;\n}\n\nion-grid > ion-row > ion-col > ion-icon.nameArrowIcon,\nion-grid > ion-row > ion-col > ion-icon.IDArrowIcon,\nion-grid > ion-row > ion-col > ion-icon.startDateArrowIcon,\nion-grid > ion-row > ion-col > ion-icon.endDateArrowIcon {\n  width: 50px;\n  position: relative;\n  vertical-align: bottom;\n  padding-top: 10px;\n}\n\nion-grid > ion-row > ion-col > ion-icon.active {\n  color: darkblue;\n}\n\n.actionColumn {\n  display: inline-flex;\n  min-width: 175px !important;\n}\n\n.actionColumn > ion-icon.saveItem {\n  margin-left: 35px;\n}\n\n.optionsPanel {\n  float: left;\n  min-width: 750px;\n  display: flex;\n}\n\n#searchBar {\n  min-width: 400px;\n}\n\n#mobileToggle {\n  border-style: none !important;\n  border-width: 0px !important;\n}\n\n.saveNewWatchList {\n  width: 111px;\n}\n\n.addColumn {\n  top: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdGNobGlzdC5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxXQUFBO0VBQ0EsY0FBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtFQUNBLFdBQUE7QUFDSjs7QUFFQTtFQUNJLFdBQUE7RUFDQSxZQUFBO0FBQ0o7O0FBRUE7RUFDSyxpQkFBQTtBQUNMOztBQUVBO0VBQ0ksb0JBQUE7RUFDQSxpQkFBQTtBQUNKOztBQUVBO0VBQ0ksZ0JBQUE7QUFDSjs7QUFFQTtFQUNJLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFFBQUE7QUFDSjs7QUFFQTtFQUNJLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBQ0o7O0FBRUE7RUFDSSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtBQUNKOztBQUVBO0VBQ0ksb0JBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0ssb0JBQUE7RUFDQSxlQUFBO0FBQ0w7O0FBRUE7RUFDSSxvQkFBQTtFQUNBLHVCQUFBO0VBQ0EsMkJBQUE7QUFDSjs7QUFFQTtFQUNJLG9CQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0ksb0JBQUE7QUFDSjs7QUFFQTtFQUNJLG9CQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0ksdUJBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0ksdUJBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0csdUJBQUE7RUFDQSwyQkFBQTtBQUNIOztBQUVBO0VBQ0csdUJBQUE7RUFDQSwyQkFBQTtBQUNIOztBQUVBO0VBQ0ksVUFBQTtFQUNBLFdBQUE7QUFDSjs7QUFFQTtFQUNLLGVBQUE7QUFDTDs7QUFFQTs7OztFQUlJLFdBQUE7RUFDQSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0EsaUJBQUE7QUFDSjs7QUFFQTtFQUNJLGVBQUE7QUFDSjs7QUFFQTtFQUNJLG9CQUFBO0VBQ0EsMkJBQUE7QUFDSjs7QUFFQTtFQUNJLGlCQUFBO0FBQ0o7O0FBRUE7RUFDSSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0FBQ0o7O0FBRUE7RUFDSSxnQkFBQTtBQUNKOztBQUVBO0VBQ0ksNkJBQUE7RUFDQSw0QkFBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtBQUNKOztBQUVBO0VBQ0ksU0FBQTtBQUNKIiwiZmlsZSI6IndhdGNobGlzdC5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaW9uLWxpc3QtcGFyZW50IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBvdmVyZmxvdzogYXV0bztcbn1cblxuaW9uLWNhcmQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbmlvbi1pY29uIHtcbiAgICB3aWR0aDogMjRweDtcbiAgICBoZWlnaHQ6IDI0cHg7XG59XG5cbmlvbi1pY29uLmNhbmNlbEJ1dHRvbiB7XG4gICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xufVxuXG5pb24taW5wdXQge1xuICAgIGJvcmRlci1zdHlsZTogZGFzaGVkO1xuICAgIGJvcmRlci13aWR0aDogMXB4O1xufVxuXG5pb24tbGFiZWwge1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG59XG5cbmlvbi1sYWJlbC5tb2JpbGUge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsZWZ0OiAxNXB4O1xuICAgIHRvcDogM3B4O1xufVxuXG5pb24tbGlzdC5tZC5saXN0LW1kIHtcbiAgICBtaW4td2lkdGg6IDEwMDBweDtcbiAgICBtYXgtaGVpZ2h0OiA1MDBweDtcbiAgICBvdmVyZmxvdzogYXV0bztcbn1cblxuaW9uLXNlbGVjdCB7XG4gICAgYm9yZGVyLXN0eWxlOiBkYXNoZWQ7XG4gICAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xufVxuXG5pb24tY29sLklEQ29sdW1uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBtYXgtd2lkdGg6IDEwNXB4ICFpbXBvcnRhbnQ7XG59XG5cbmlvbi1jb2wubmFtZUxhYmVsQ29sdW1uIHtcbiAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgIG1heC13aWR0aDogNTBweDtcbn1cblxuaW9uLWNvbC5uYW1lTGFiZWxNb2JpbGVDb2x1bW4ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIHdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xuICAgIG1heC13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbn1cblxuaW9uLWNvbC5uYW1lRGF0YU1vYmlsZUNvbHVtbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgd2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG4gICAgbWF4LXdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xufVxuXG5pb24tY29sLmRhdGVMYWJlbENvbHVtbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG59XG5cbmlvbi1jb2wuZGF0ZUxhYmVsTW9iaWxlQ29sdW1uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICB3aWR0aDogMTQ0cHggIWltcG9ydGFudDtcbiAgICBtYXgtd2lkdGg6IDE0NHB4ICFpbXBvcnRhbnQ7XG59XG5cbmlvbi1jb2wuZGF0ZURhdGFNb2JpbGVDb2x1bW4ge1xuICAgIHdpZHRoOiAxNDRweCAhaW1wb3J0YW50O1xuICAgIG1heC13aWR0aDogMTQ0cHggIWltcG9ydGFudDtcbn1cblxuaW9uLWNvbC5kYXRlRGF0YU1vYmlsZUNvbHVtbkFkZCB7XG4gICAgd2lkdGg6IDE0NHB4ICFpbXBvcnRhbnQ7XG4gICAgbWF4LXdpZHRoOiAxNDRweCAhaW1wb3J0YW50O1xufVxuXG5pb24tY29sLm5vdGVzTGFiZWxNb2JpbGVDb2x1bW4ge1xuICAgd2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG4gICBtYXgtd2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG59XG5cbmlvbi1jb2wubm90ZXNEYXRhTW9iaWxlQ29sdW1uIHtcbiAgIHdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xuICAgbWF4LXdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xufVxuXG5pb24tZ3JpZCA+IGlvbi1yb3cgPiBpb24tY29sID4gaW9uLWljb24ge1xuICAgIHdpZHRoOiA3MCU7XG4gICAgaGVpZ2h0OiA3MCU7XG59XG5cbmlvbi1ncmlkID4gaW9uLXJvdyA+IGlvbi1jb2wgPiBpb24tbGFiZWwuc3RhcnREYXRlTGFiZWwge1xuICAgICBtYXgtd2lkdGg6IDc1cHg7XG59XG5cbmlvbi1ncmlkID4gaW9uLXJvdyA+IGlvbi1jb2wgPiBpb24taWNvbi5uYW1lQXJyb3dJY29uLCBcbmlvbi1ncmlkID4gaW9uLXJvdyA+IGlvbi1jb2wgPiBpb24taWNvbi5JREFycm93SWNvbiwgXG5pb24tZ3JpZCA+IGlvbi1yb3cgPiBpb24tY29sID4gaW9uLWljb24uc3RhcnREYXRlQXJyb3dJY29uLFxuaW9uLWdyaWQgPiBpb24tcm93ID4gaW9uLWNvbCA+IGlvbi1pY29uLmVuZERhdGVBcnJvd0ljb24ge1xuICAgIHdpZHRoOiA1MHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xuICAgIHBhZGRpbmctdG9wOiAxMHB4O1xufVxuXG5pb24tZ3JpZCA+IGlvbi1yb3cgPiBpb24tY29sID4gaW9uLWljb24uYWN0aXZlIHtcbiAgICBjb2xvcjogZGFya2JsdWVcbn1cblxuLmFjdGlvbkNvbHVtbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgbWluLXdpZHRoOiAxNzVweCAhaW1wb3J0YW50O1xufVxuXG4uYWN0aW9uQ29sdW1uID4gaW9uLWljb24uc2F2ZUl0ZW0ge1xuICAgIG1hcmdpbi1sZWZ0OiAzNXB4O1xufVxuXG4ub3B0aW9uc1BhbmVsIHtcbiAgICBmbG9hdDogbGVmdDtcbiAgICBtaW4td2lkdGg6IDc1MHB4O1xuICAgIGRpc3BsYXk6IGZsZXg7XG59XG5cbiNzZWFyY2hCYXIge1xuICAgIG1pbi13aWR0aDogNDAwcHg7XG59XG5cbiNtb2JpbGVUb2dnbGUge1xuICAgIGJvcmRlci1zdHlsZTogbm9uZSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci13aWR0aDogMHB4ICFpbXBvcnRhbnQ7ICAgIFxufVxuXG4uc2F2ZU5ld1dhdGNoTGlzdCB7XG4gICAgd2lkdGg6IDExMXB4O1xufVxuXG4uYWRkQ29sdW1uIHtcbiAgICB0b3A6IDEwcHg7XG59Il19 */");

/***/ }),

/***/ 4569:
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/watchlist/watchlist.page.html ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header [translucent]=\"true\">\n     <ion-toolbar>\n          <ion-title>WatchList</ion-title>\n     </ion-toolbar>\n</ion-header>\n\n<ion-content>\n     <ion-refresher slot=\"fixed\" (ionRefresh)=\"doRefresh($event)\">\n          <ion-refresher-content></ion-refresher-content>\n     </ion-refresher>\n     \n     <ion-grid>\n          <ion-row class=\"optionsPanel\">\n               <ion-col size=\"1\" class=\"addColumn\">\n                    <ion-icon *ngIf=\"!isAdding && !isEditing\" class=\"addWatchList\" name=\"add-outline\" (click)=\"addWatchList()\"></ion-icon>\n               </ion-col>\n\n               <ion-col size=\"7\" id=\"searchBar\">\n                    <ion-searchbar (ionChange)=\"searchFilter()\" [disabled]=\"isAdding || isEditing\" [(ngModel)]=\"dataService.searchTerm\"></ion-searchbar>\n               </ion-col>\n\n               <ion-col size=\"4\" id=\"mobileToggle\">\n                    <ion-item>Mobile<ion-toggle [(ngModel)]=\"dataService.isMobilePlatform\" color=\"primary\"></ion-toggle></ion-item>\n               </ion-col>\n          </ion-row>\n     </ion-grid>\n\n     <div class=\"ion-list-parent\">\n          <ion-list>\n               <ion-item> <!-- Table headers -->\n                    <ion-grid>\n                         <ion-row>\n                              <ion-col size=\"2\" class=\"IDColumn\">\n                                   <ion-label>ID</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'ID' ? 'upArrow IDArrowIcon active' : 'upArrow IDArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('ID','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'ID' ? 'downArrow IDArrowIcon active' : 'downArrow IDArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('ID','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameLabelMobileColumn' : 'nameLabelColumn'\">\n                                   <ion-label>Name</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'Name' ? 'upArrow nameArrowIcon active' : 'upArrow nameArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('Name','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'Name' ? 'downArrow nameArrowIcon active' : 'downArrow nameArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('Name','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'dateLabelMobileColumn' : 'dateLabelColumn'\">\n                                   <ion-label class=\"startDateLabel\">Start Date</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'StartDate' ? 'upArrow startDateArrowIcon active' : 'upArrow startDateArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('StartDate','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'StartDate' ? 'downArrow startDateArrowIcon active' : 'downArrow startDateArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('StartDate','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'dateLabelMobileColumn' : 'dateLabelColumn'\">\n                                   <ion-label>End Date</ion-label><ion-icon *ngIf=\"sortDirection =='ASC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'EndDate' ? 'upArrow endDateArrowIcon active' : 'upArrow endDateArrowIcon'\" name=\"caret-up-outline\" (click)=\"sortClick('EndDate','ASC')\"></ion-icon><ion-icon *ngIf=\"sortDirection =='DESC' && !isAdding && !isEditing\" [ngClass]=\"sortActiveColumn === 'EndDate' ? 'downArrow endDateArrowIcon active' : 'downArrow endDateArrowIcon'\" name=\"caret-down-outline\" (click)=\"sortClick('EndDate','DESC')\"></ion-icon>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'notesLabelMobileColumn' : 'notesLabelColumn'\">\n                                   <ion-label>Notes</ion-label>\n                              </ion-col>\n                         \n                              <ion-col size=\"2\">\n                                   <ion-label></ion-label>\n                              </ion-col>\n                         </ion-row>\n                    </ion-grid>               \n               </ion-item>\n\n               <ion-item *ngIf=\"isAdding\">  <!-- Add Panel -->\n                    <ion-grid>\n                         <ion-row>\n                              <ion-col size=\"2\" class=\"IDColumn\"></ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameDataMobileColumn' : ''\">\n                                   <ion-select placeholder='Name' name=\"title\" [(ngModel)]=\"addItemName\">\n                                        <ion-select-option *ngFor=\"let currItem of dataService.watchListItems;trackBy: trackByFn\" [value]=\"currItem.WatchListItemID\">{{currItem.WatchListItemName}}</ion-select-option>\n                                   </ion-select>\n                              </ion-col>\n                    \n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'dateDataMobileColumnAdd' : ''\">\n                                   <ion-input type=\"date\" [(ngModel)]=\"addItemStartDate\" [value]=\"addItemStartDate\" ></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'dateDataMobileColumnAdd' : ''\">\n                                   <ion-input type=\"date\" [(ngModel)]=\"addItemEndDate\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'notesDataMobileColumn' : ''\">\n                                   <ion-input type=\"text\" [(ngModel)]=\"addItemNotes\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"1\" class=\"actionColumn\">\n                                   <ion-icon class=\"saveNewWatchList\" name=\"save-outline\" (click)=\"saveNewWatchList()\"></ion-icon>\n                                   <ion-icon name=\"close-circle-outline\" class=\"cancelButton\" (click)=\"cancelAddWatchList()\"></ion-icon>\n                              </ion-col>\n                         </ion-row>\n                    </ion-grid>\n               </ion-item>\n\n               <ion-item *ngFor=\"let currWatchList of dataService.watchList\"> <!-- Data Panel -->\n                    <ion-grid>\n                         <ion-row>\n                              <ion-col size=\"2\" class=\"IDColumn\">\n                                   <ion-label>{{ currWatchList.WatchListID }}</ion-label>\n                              </ion-col>\n                              \n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'nameDataMobileColumn' : ''\">\n                                   <ion-select placeholder='Name' name=\"title\" [disabled]=\"currWatchList.Disabled\" [(ngModel)]=\"currWatchList.WatchListItemID\">\n                                        <ion-select-option *ngFor=\"let currItem of dataService.watchListItems;trackBy: trackByFn\" [value]=\"currItem.WatchListItemID\">{{currItem.WatchListItemName}}</ion-select-option>\n                                   </ion-select>\n                              </ion-col>                             \n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'dateDataMobileColumn' : ''\">\n                                   <ion-input [disabled]=\"currWatchList.Disabled\" class=\"dateField\" type=\"text\" [(ngModel)]=\"currWatchList.StartDate\" [value]=\"currWatchList.StartDate\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'dateDataMobileColumn' : ''\">\n                                   <ion-input [disabled]=\"currWatchList.Disabled\" class=\"dateField\" type=\"text\" [(ngModel)]=\"currWatchList.EndDate\" [value]=\"currWatchList.StartDate\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" [ngClass]=\"dataService.isMobilePlatform == true ? 'notesDataMobileColumn' : ''\">\n                                   <ion-input [disabled]=\"currWatchList.Disabled\" type=\"text\" [(ngModel)]=\"currWatchList.Notes\"></ion-input>\n                              </ion-col>\n\n                              <ion-col size=\"2\" class=\"actionColumn\">\n                                   <ion-icon *ngIf=\"currWatchList.Disabled && !isAdding && !isEditing\" name=\"create-outline\" (click)=\"editWatchList(currWatchList)\"></ion-icon>\n                                   <ion-icon *ngIf=\"!currWatchList.Disabled\" class=\"saveItem\" name=\"save-outline\" (click)=\"saveWatchList(currWatchList)\"></ion-icon>\n                                   <ion-icon *ngIf=\"!currWatchList.Disabled\" name=\"close-circle-outline\" class=\"cancelButton\" (click)=\"cancelEditWatchList(currWatchList)\"></ion-icon>\n                              </ion-col>\n                         </ion-row>                    \n                    </ion-grid>\n               </ion-item>\n          </ion-list>\n     </div>\n</ion-content>\n");

/***/ })

}]);
//# sourceMappingURL=src_app_watchlist_watchlist_module_ts.js.map