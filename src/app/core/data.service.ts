import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs/';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import IWatchList from '../interfaces/watchlist.interface';
import IWatchListItem from '../interfaces/watchlistitem.interface';
import IWatchListQueueItem from '../interfaces/watchlistqueueitem.interface';
import IWatchListSource from '../interfaces/watchlistsource.interface';
import IWatchListType from '../interfaces/watchlisttype.interface';
import IUser from '../interfaces/user.interface';
import { Platform } from '@ionic/angular';

@Injectable({
     providedIn: `root`,
})
export class DataService {
     authGuardDisabled = false;
     detailObjectName: string=null;
     detailID: number=null;
     detailWatchListItemID: number=null;
     IMDBSearchEnabled = false;
     imdb_url_missing = false;
     incompleteFilter = true;
     isError = false;
     isIMDBSearchEnabled = false;
     isLoggedIn = false;
     isLoggedInCheckComplete = false;
     isMobile = false;
     itemsPerPage = 20;
     readonly ratingMax = 5;
     recordLimit = 10;
     searchTerm = '';
     sourceFilter = '';
     typeFilter = '';
     userData: IUser=this.iUserEmpty();
     watchList: IWatchList[];
     watchListItems: any;
     watchListNames: any;
     watchListQueue: any;
     watchListSortActiveColumn = 'Name';
     watchListSortColumn = 'Name';
     watchListSortDirection = 'ASC';
     watchListItemsSortActiveColumn = 'Name';
     watchListItemsSortColumn = 'Name';
     watchListItemsSortDirection = 'ASC';
     watchListSources: IWatchListSource[];
     watchListTypes: IWatchListType[];

     private readonly watchListColumnSizes = {
          ID: 1,
          Name: 2,
          StartDate: 2,
          EndDate: 2,
          Source : 2,
          Season : 1,
          Rating : 1,
          //Notes : 1,
     };

     private readonly watchListItemsColumnSizes = {
          ID: 1,
          Name: 4,
          Type: 2,
          IMDBURL: 8,
          //Notes : 2,
     };

     private readonly watchListQueueColumnSizes = {
          ID: 2,
          Name: 3,
          Notes : 3,
          Action : 2,
     };

     private readonly validObjectNames = [
          'WatchList',
          'WatchListItems',
          'WatchListQueue'
     ];

     constructor(public alertController: AlertController,
                 private http: HttpClient,
                 private platform: Platform,
                 private storage: Storage,
                 public toastController: ToastController,
                 private router: Router) {

          if (this.platform.is('ios') || this.platform.is('android')) {
               this.isMobile = true;
          }

          this.getBackendURL();

          this.getItemsPerPageFilter();

          this.getIncompleteFilter();

          this.getRecordLimitFilter();

          this.getSourceFilter();

          this.getTypeFilter();

          this.getIMDBURLMissingFilter();
     }

     addWatchList(currWatchList: IWatchList) {
          let params = new HttpParams();
          params = params.append('WatchListItemID',currWatchList.WatchListItemID);
          params = params.append('StartDate',String(currWatchList.StartDate));

          if (currWatchList.EndDate !== null && String(currWatchList.EndDate) !== '') {
               params = params.append('EndDate',String(currWatchList.EndDate));
          }

          if (currWatchList.WatchListSourceID !== null && String(currWatchList.WatchListSourceID) !== '') {
               params = params.append('WatchListSourceID',currWatchList.WatchListSourceID);
          }

          if (currWatchList.Season !== null && String(currWatchList.Season) !== '') {
               params = params.append('Season',currWatchList.Season);
          }

          if (currWatchList.Notes !== null && currWatchList.Notes !== '') {
               params = params.append('Notes',currWatchList.Notes);
          }

          return this.runRest(`/AddWatchList`,'PUT',params);
     }

     addWatchListItem(currWatchListItem: IWatchListItem) {
          let params = new HttpParams();

          params = params.append('WatchListItemName',currWatchListItem.WatchListItemName);
          params = params.append('WatchListTypeID',currWatchListItem.WatchListTypeID);

          if (currWatchListItem.IMDB_URL !== null && currWatchListItem.IMDB_URL !== '') {
               params = params.append('IMDB_URL',currWatchListItem.IMDB_URL);
          }

          if (currWatchListItem.IMDB_Poster !== null && currWatchListItem.IMDB_Poster !== '') {
               params = params.append('IMDB_Poster',currWatchListItem.IMDB_Poster);
          }

          if (currWatchListItem.ItemNotes !== null && currWatchListItem.ItemNotes !== '') {
               params = params.append('ItemNotes',currWatchListItem.ItemNotes);
          }

          return this.runRest(`/AddWatchListItem`,'PUT',params);
     }

     addWatchListQueueItem(currWatchListQueue: any) {
          let params = new HttpParams();
          params = params.append('WatchListItemID',currWatchListQueue.watchListItemID);

          if (currWatchListQueue.notes !== null && currWatchListQueue.notes !== '') {
               params = params.append('Notes',currWatchListQueue.notes);
          }

          return this.runRest(`/AddWatchListQueueItem`,'PUT',params);
     }

     async alert(message: string) {
          const alert = await this.alertController.create({
               header: 'Alert',
               subHeader: '',
               message: message,
               buttons: ['OK'],
          });

          await alert.present();
     }

     autoAddWatchListRecord(iMDB_URL = null) {
          const ids = this.watchListItems.map((thisWatchList: IWatchList) => { return thisWatchList.WatchListItemID; });

          const newID = Math.max(...ids) + 1;
          const existing=this.watchListItems.filter((wli: IWatchListItem) => wli.IMDB_URL === iMDB_URL)[0];

          const currWatchList: any=[];
          currWatchList.WatchListItemID=(typeof existing !== 'undefined' ? existing.WatchListItemID : newID);
          this.detailWatchListItemID=currWatchList.WatchListItemID;

          this.confirmDialog(currWatchList,'Do you want to add a Watchlist record now ?',this.showWatchListDetail.bind(this));
     }

     closeOverlay() {
          this.router.navigateByUrl(`/tabs/${this.detailObjectName}`);

          this.detailObjectName=null;

          this.detailID=null;
     }

     async confirmDialog(param: object, messageStr: string, callback: any) {
          const alert = await this.alertController.create({
               header: 'Alert',
               message: messageStr,
               buttons: ['OK','Cancel']
          });

          this.authGuardDisabled=true;

          await alert.present();

          const { role } = await alert.onDidDismiss();

          if (role !== 'cancel' ) { // OK
               callback(param);
          } else {
               this.authGuardDisabled=false;
          }
     }

     deleteWatchList(watchListID: number) {
          let params = new HttpParams();

          params = params.append('WatchListID',watchListID);

          return this.runRest(`/DeleteWatchList`,'PUT',params);
     }

     deleteWatchListItem(watchListItemID: string) {
          let params = new HttpParams();

          params = params.append('WatchListItemID',watchListItemID);

          return this.runRest(`/DeleteWatchListItem`,'PUT',params);
     }

     deleteWatchListQueueItem(watchListQueueItemID: number) {
          let params = new HttpParams();

          params = params.append('WatchListQueueItemID',watchListQueueItemID);

          return this.runRest(`/DeleteWatchListQueueItem`,'PUT',params);
     }

     async getBackendURL() {
          await this.storage.create();

          let url = '';

          try {
               url = await this.storage.get('BackEndURL');
          } catch(e) {
          }

          if (url !== null && url.length > 0 && url.endsWith('/')) {
               url=url.slice(0,-1);
          }

          if (typeof this.userData !== 'undefined') {
               this.userData.BackendURL = url;
          } else {
               this.userData = this.iUserEmpty();
               this.userData.BackendURL=window.location.origin;
          }

          this.loginWorkflow();
     }

     getColumnSize(columnName: string, component: string) {
          if (component === 'WatchList') {
               return this.watchListColumnSizes[columnName];
          } else if (component === 'WatchListItems') {
               return this.watchListItemsColumnSizes[columnName];
          } else if (component === 'WatchListQueueItems') {
               return this.watchListQueueColumnSizes[columnName];
          }
     }

     getDetailID() {
          return this.detailID;
     }

     getDetailObject() {
          if (this.detailObjectName === null) {
               return null;
          }

          switch(this.detailObjectName) {
               case 'watchlist':
                    return this.watchList.filter((wl: IWatchList) => wl.WatchListID === this.detailID)[0];
               case 'watchlist-items':
                    return this.watchListItems.filter((wli: IWatchListItem) => wli.WatchListItemID === this.detailID)[0];
               case 'watchlist-queue':
                    return this.watchListQueue.filter((wlq: IWatchListQueueItem) => wlq.WatchListQueueItemID === this.detailID)[0];
          }
     }

     getDetailObjectName() {
          return this.detailObjectName;
     }

     getDetailWatchListItemID() {
          return this.detailWatchListItemID;
     }

     getIMDBSearchEnabled() {
          return this.runRest(`/IsIMDBSearchEnabled`,'GET',null);
     }

     getIMDBSearchEnabledSubscription() {
          this.getIMDBSearchEnabled().subscribe((response) => {
               this.isIMDBSearchEnabled=response;

               this.getWatchListSubscription(); // Load WatchList
          },
          error => {
               this.handleError(`The error "${error.error}" occurred while getting the IMDB Search enabled status`);
          });
     }

     async getIMDBURLMissingFilter() {
          this.imdb_url_missing = await this.storage.get('IMDBURLMissingFilter');
     }

     getIMDBURL(watchListItemID: number) {
          if (this.getWatchListItems.length === 0) {
               return;
          }

          try {
               for (let i=0;i<this.watchListNames.length;i++) {
                    if (this.watchListItems[i].WatchListItemID === watchListItemID && this.watchListItems[i].IMDB_URL !== null) {
                         return this.watchListItems[i].IMDB_URL;
                    }
               }
          } catch(e) {
               return null;
          }

          return null;
     }

     async getRecordLimitFilter() {
          this.recordLimit = await this.storage.get('RecordLimitFilter');
     }

     async getItemsPerPageFilter() {
          this.itemsPerPage = await this.storage.get('ItemsPerPage');
           
          if (this.itemsPerPage === null) {
               this.itemsPerPage=20;
          }
     }

     async getIncompleteFilter() {
          this.incompleteFilter = await this.storage.get('IncompleteFilter');
     }

     getSortClass(columnName: string, sortDirection: string, activeSortColumn: string) {
          const icons = {
               "ID": "IDArrowIcon",
               "Name": "NameArrowIcon",
               "StartDate": "StartDateArrowIcon",
               "EndDate": "EndDateArrowIcon",
               "WatchListSourceID": "SourceArrowIcon",
               "WatchListTypeID": "TypeArrowIcon",
               "IMDB_URL": "IMDBURLArrowIcon"
          }

          const className=(sortDirection ==='ASC' ? "upArrow " : "downArrow ") +
          icons[columnName] + " " +
          (activeSortColumn === columnName ? "active " : "") +
          "header"

          return className;
     }

     getSortIconName(sortDirection: string) {
          if (typeof sortDirection === 'undefined')
               return;

          return (sortDirection === "ASC" ? "caret-up-outline" : "caret-down-outline")
     }

     async getSourceFilter() {
          this.sourceFilter = await this.storage.get('SourceFilter');
     }

     getSourceName(sourceID: number) {
          try {
               return this.watchListSources.filter((wls: IWatchListSource) => wls.WatchListSourceID === sourceID)[0].WatchListSourceName;
          } catch(e) {
               return '';
          }
     }

     async getTypeFilter() {
          this.typeFilter = await this.storage.get('TypeFilter');
     }

     getWatchList() {
          let params = new HttpParams();

          if (this.watchListSortColumn !== null && this.watchListSortDirection !== null) {
               params = params.append('SortColumn',this.watchListSortColumn);
               params = params.append('SortDirection', this.watchListSortDirection);
          }

          return this.runRest(`/GetWatchList`,'GET',params);
     }

     getWatchListItemName(watchListItemID: number) {
          try {
               for (let i=0;i<this.watchListNames.length;i++) {
                    if (this.watchListNames[i].WatchListItemID === watchListItemID) {
                         return this.watchListNames[i].WatchListItemName;
                    }
               }
          } catch(e) {
               return null;
          }

          return null;
     }

     getWatchListItems(loadAllData: boolean) {
          let params = new HttpParams();

          if (this.watchListSortColumn !== null && this.watchListSortDirection !== null) {
               params = params.append('SortColumn',this.watchListItemsSortColumn);
               params = params.append('SortDirection', this.watchListItemsSortDirection);
          }

          return this.runRest(`/GetWatchListItems`,'GET',params);
     }

     getWatchListItemsSubscription(loadAllData: boolean) {
          if (this.isError)
               return;

          this.getWatchListItems(loadAllData).subscribe((response) => {
               if (response === null || (response.length === 1 && response[0] === 'ERROR')) {
                    if (response !== null) {
                         this.alert(`The error ${response[1]} occurred`);
                    }

                    return;
               }

               if (response !== null) {
                    for (let i=0;i<response.length;i++) {
                         response[i].Disabled = true;
                    }
               }

               this.watchListItems=response;

               if (this.watchListNames === null || loadAllData === true) {
                    this.watchListNames = response;
               }

               this.getWatchListQueueSubscription();
          },
          error => {
               this.handleError(`The error "${error.error}" occurred while getting the WatchList Items`);
          });
     }

     getWatchListMovieStats() {
          return this.runRest(`/GetWatchListMovieStats`,'GET',null);
     }

     getWatchListQueue() {
          let params = new HttpParams();

          if (this.searchTerm !== null && this.searchTerm !== '') {
               params = params.append('SearchTerm',this.searchTerm);
          }

          return this.runRest(`/GetWatchListQueue`,'GET',params);
     }

     getWatchListQueueSubscription() {
          if (this.isError)
               return;

          this.getWatchListQueue().subscribe((response) => {
               if (response !== null) {
                    for (let i=0;i<response.length;i++) {
                         response[i].Disabled = true;
                    }
               }

               this.watchListQueue=response;

               this.getWatchListTypesSubscription();
          },
          error => {
               this.handleError(`The error "${error.error}" occurred while getting the WatchList Queue`);
          });
     }

     getWatchListSources() {
          return this.runRest(`/GetWatchListSources`,'GET',null);
     }

     getWatchListSourceStats() {
          return this.runRest(`/GetWatchListSourceStats`,'GET',null);
     }

     getWatchListSourcesSubscription() {
          if (this.isError)
               return;

          this.getWatchListSources().subscribe((response) => {
               this.watchListSources=response;
          },
          error => {
               this.handleError(`The error "${error.error}" occurred while getting the WatchList Sources`);
          });
     }

     getWatchListSubscription() {
          if (this.isError)
               return;

          this.getWatchList().subscribe((response) => {
               if (response !== null) {
                    for (let i=0;i<response.length;i++) {
                         response[i].Disabled = true;
                    }
               }

               this.watchList=response;

               this.getWatchListItemsSubscription(true); // Load WatchList Items
          },
          error => {
               this.handleError(`The error "${error.error}" occurred while getting the WatchList`);
          });
     }

     getWatchListTopRatedStats() {
          return this.runRest(`/GetWatchListTopRatedStats`,'GET',null);
     }

     getWatchListTVStats() {
          return this.runRest(`/GetWatchListTVStats`,'GET',null);
     }

     getWatchListTypeName(watchListTypeID: number) {
          if (typeof this.watchListTypes === 'undefined') {
               return;
          }

          const typeObj=this.watchListTypes?.filter((wlt: IWatchListType) => wlt.WatchListTypeID === watchListTypeID)[0];

          if (typeof typeObj !== 'undefined') {
               return typeObj.WatchListTypeName;
          } else {
               return null;
          }
     }

     getWatchListTypeNameByWatchListItemID(watchListItemID: number) {
          if (watchListItemID === 0) {
               return;
          }

          // If watchListItems or watchListTypes are not loaded, this will throw an error
          try {
               // Get type of current watchlist item ID
               const currentWatchListItem=this.watchListItems.filter((wli: IWatchListItem) => String(wli.WatchListItemID) === String(watchListItemID))[0];

               if (currentWatchListItem !== null) {
                    const typeObj=this.watchListTypes.filter((wlt: IWatchListType) => {
                         return wlt.WatchListTypeID === currentWatchListItem.WatchListTypeID;
                    })[0];

                    if (typeObj !== null) {
                         return typeObj.WatchListTypeName;
                    } else {
                         return null;
                    }
               } else {
                    return null;
               }
          } catch(e) {
          }
     }

     getWatchListTypes() {
          return this.runRest(`/GetWatchListTypes`,'GET',null);
     }

     getWatchListTypesSubscription() {
          if (this.isError)
               return;

          this.getWatchListTypes().subscribe((response) => {
               this.watchListTypes=response;

               this.getWatchListSourcesSubscription();
          },
          error => {
               this.handleError(`The error "${error.error}" occurred while getting the WatchList Types`);
          });
     }

     handleError(error: Response | any) {
          this.isError = true;

          console.log(error);
          this.alert(error);

          if (error.error === 'Unauthorized') {
                    console.log('Unauthorized. Check the Auth Key');
          } else if (error.error instanceof Error) {
               const errMessage = error.error.message;

               return throwError(errMessage);
               // Use the following instead if using lite-server
               // return Observable.throw(err.text() || 'backend server error');
          }

          return throwError(error || 'Node.js server error');
     }

     isBackendURLSet() {
          return (typeof this.userData !== 'undefined'
               && this.userData.BackendURL !== null
               && this.userData.BackendURL !== ''
               ? true : false);
     };

     iUserEmpty(): IUser {
          return {
               UserID: 0,
               Username: '',
               Password: '',
               Realname: '',
               BackendURL: '',
           }
     }

     iWatchListEmpty(): IWatchList {
          return {
               WatchListID: null,
               UserID: null,
               WatchListItemID: null,
               StartDate: null,
               EndDate: null,
               WatchListSourceID: null,
               Season: null,
               Rating: null,
               IMDB_Poster : null,
               Notes: null
          };
     }

     iWatchListItemEmpty(): IWatchListItem {
          return {
               WatchListItemID: null,
               WatchListItemName: null,
               WatchListTypeID: null,
               IMDB_URL: null,
               IMDB_Poster : null,
               ItemNotes: null,
               Previous: null
          };
     }

     iWatchListQueueItemEmpty(): IWatchListQueueItem {
          return {
               WatchListQueueItemID: null,
               UserID: null,
               WatchListItemID: null,
               WatchListItemName: null,
               WatchListTypeID: null,
	          IMDB_Poster: null,
               Notes: null,
               Previous: null
          };
     }

     iWatchListSourceEmpty(): IWatchListSource {
          return {
               WatchListSourceID: null,
               WatchListSourceName: null
          };
     }

     iWatchListTypeEmpty(): IWatchListType {
          return {
               WatchListTypeID: null,
               WatchListTypeName: null
          };
     }

     login() {
          const headers = {
               headers: {
                    wl_username: (typeof this.userData !== 'undefined' ? this.userData.Username : ''),
                    wl_password: (typeof this.userData !== 'undefined' ? this.userData.Password : ''),
               },
               withCredentials: true
          };

          return this.http.put<any>(`${this.userData.BackendURL}/Login`,null, headers);
     }

     loginSubscription(username: string, password: string,  backendURL: string) {
          if (typeof this.userData !== 'undefined') {
               this.userData.Username=username;
               this.userData.Password=password;

               if (backendURL !== null && backendURL !== '') {
                    this.userData.BackendURL=backendURL;
               }
          }

          if (backendURL !== null && backendURL !== '') {
               this.setBackendURL();
          }

          this.login().subscribe((response) => {
               if (response[0] === 'OK') {
                    this.loginSuccessfullActions(response[1]);
               } else {
                    this.alert('Login failed. Please check your username and password');
               }
          },
          error => {
               this.alert('Login failed. Please check your username and password');
               this.router.navigateByUrl('/tabs/login');
          });
     }

     loginSuccessfullActions(response) {
          this.isLoggedIn = true;

          try { // when check if logged in already, user payload is not present so ignore any errors
               if (typeof response[0].UserID !== 'undefined' && typeof this.userData !== 'undefined') {
                    this.userData.UserID = response[0].UserID;
               }

               if (typeof response[0].Username !== 'undefined' && typeof this.userData !== 'undefined') {
                    this.userData.Username = response[0].Username;
               }

               if (typeof response[0].Realname !== 'undefined' && typeof this.userData !== 'undefined') {
                    this.userData.Realname = response[0].Realname;
               }

               if (typeof response[0].Realname !== 'undefined' && typeof this.userData !== 'undefined') {
                    this.userData.Realname = response[0].Realname;
               }

               if (typeof response[0].BackEndURL !== 'undefined' && typeof this.userData !== 'undefined') {
                    this.userData.BackendURL = response[0].BackendURL;
                    this.setBackendURL();

                    //localStorage.setItem('BackendURL', response[0].BackendURL);
               }
          } catch(err) {}

          this.getIMDBSearchEnabledSubscription();          

          this.router.navigateByUrl('/tabs/watchlist');
     }

     loginWorkflow() {
          // This gets called after the backend URL is set
          if (this.userData.BackendURL === null || this.userData.BackendURL === '') {
               this.isLoggedInCheckComplete=true;
               this.router.navigateByUrl('/tabs/login');
               return;
          } else {
               const headers = {                    
                    withCredentials: true
               };

               this.http.get<any>(`${this.userData.BackendURL}/IsLoggedIn`,headers).subscribe((response) => {
                    var isLoggedIn = response[1];

                    this.isLoggedInCheckComplete=true;

                    if (isLoggedIn === null) {
                         this.router.navigateByUrl('/tabs/login');
                    } else {
                         this.loginSuccessfullActions(response[1]);
                    }                    
               },
               error => {
                   this.isLoggedInCheckComplete=true;
                   this.router.navigateByUrl('/tabs/login');
               });
          }
     }

     openDetailOverlay(objectName: string, objectID: number) {
          if (this.detailObjectName !== null) { // Ignore because overlay is already open
               return;
          }

          if (objectName === null) {
               this.alert(`objectName not provided`);
               return;
          }

          if (this.validObjectNames[objectName] === null) {
               this.alert(`Invalid objectName ${objectName}`);
               return;
          }

          this.detailObjectName=objectName;

          this.detailID=objectID;

          this.router.navigate(['/tabs/detail-overlay',{ ObjectName : objectName}]);
     }

     pullToRefresh(event: any, component: string) {
          setTimeout(() => {
               if (component === 'WatchList') {
                    this.getWatchList().subscribe((response) => {
                         if (response !== null) {
                              for (let i=0;i<response.length;i++) {
                                   response[i].Disabled = true;
                              }
                         }

                         this.watchList = response;

                         event.target.complete();
                    },
                    error => {
                         this.alert(`An error occurred getting the Watchlist ${error}`);
                    });
               } else if (component === 'WatchListItems') {
                    this.getWatchListItems(true).subscribe((response) => {
                         if (response !== null) {
                              for (let i=0;i<response.length;i++) {
                                   response[i].Disabled = true;
                              }
                         }

                         this.watchListItems=response;

                         event.target.complete();
                    },
                    error => {
                         this.alert(`An error occurred getting the Watchlist Items ${error}`);
                    });
               } else if (component === 'WatchListQueueItems') {
                    this.getWatchListQueue().subscribe((response) => {
                         if (response !== null) {
                              for (let i=0;i<response.length;i++) {
                                   response[i].Disabled = true;
                              }
                         }

                         this.watchListQueue=response;

                         event.target.complete();
                    },
                    error => {
                         this.alert(`An error occurred getting the Watchlist Queue ${error}`);
                    });
               }
          }, 2000);
     }

     runRest(path: string, verb: string, params: HttpParams): Observable<any> {
          if (params === null) {
              params = new HttpParams();
          }

          const headers = {
               withCredentials: true
          };

          if (typeof this.userData !== 'undefined' && this.userData.BackendURL.endsWith('/')) {
               this.userData.BackendURL=this.userData.BackendURL.slice(0,-1);
          }

          switch(verb) {
               case 'GET':
                    return this.http.get<any>(this.userData.BackendURL + path + (params !== null ? '?' + params : ''), headers);
               case 'PUT':
                    return this.http.put<any>(this.userData.BackendURL + path + (params !== null ? '?' + params : ''), null,headers);
          }
     }

     async saveIMDBURLMissingFilter() {
          await this.storage.set('IMDBURLMissingFilter',this.imdb_url_missing);
     }

     async saveIncompleteFilter() {
          await this.storage.set('IncompleteFilter',this.incompleteFilter);
     }

     async saveItemsPerPageFilter() {
          await this.storage.set('ItemsPerPage',this.itemsPerPage);
     }

     async saveRecordLimitFilter() {
          await this.storage.set('RecordLimitFilter',this.recordLimit);
     }

     async saveSourceFilter() {
          await this.storage.set('SourceFilter',this.sourceFilter);
     }

     async saveTypeFilter() {
          await this.storage.set('TypeFilter',this.typeFilter);
     }

     searchIMDB(searchTerm: string) {
          let params = new HttpParams();

          if (searchTerm !== '') {
               params = params.append('SearchTerm',searchTerm);
          }

          return this.runRest(`/SearchIMDB`,'GET',params);
     }

     searchTermChangeHandler(event: any) {
          if (event !== null)
               this.setSearchTerm(event.target.value);
     }

     async setBackendURL() {
          if (this.userData.BackendURL !== null && this.userData.BackendURL !== '') {
               // Remove trailing slash
               const url=(this.userData.BackendURL.endsWith('/') ? this.userData.BackendURL.slice(0,-1)
                                                                    : this.userData.BackendURL);
               await this.storage.set('BackEndURL', url);
          } else {
              await this.storage.remove('BackEndURL');

              this.watchList=[];
              this.watchListItems = [];
              this.watchListSources = [];
              this.watchListTypes = [];
          }
     }
 
     setWatchList(newWatchList: any) {
          this.watchList=newWatchList;
     }

     setSearchTerm(newSearchTerm: string) {
          this.searchTerm=newSearchTerm;
     }

     setWatchListItems(newWatchListItems: any) {
          this.watchListItems=newWatchListItems;
     }

     showWatchListDetail(currWatchList: any) {
          // This is activated after adding a WatchListItem when you say yes to add a WatchList item now prompt
          this.openDetailOverlay('watchlist',currWatchList.WatchListItemID);
     }

     sortClick(name: string,direction: string, component: string) {
          if (component === 'WatchList') {
               this.watchListSortColumn = name;
               this.watchListSortActiveColumn = name;

               if (direction === 'ASC') {
                    this.watchListSortDirection = 'DESC';
               } else {
                    this.watchListSortDirection = 'ASC';
               }

               this.getWatchListSubscription(); // Reload WatchList after user clicks on sort icons
          } else if (component ==='WatchListItems') {
               this.watchListItemsSortColumn = name;
               this.watchListItemsSortActiveColumn = name;

               if (direction === 'ASC') {
                    this.watchListItemsSortDirection = 'DESC';
               } else {
                    this.watchListItemsSortDirection = 'ASC';
               }

               this.getWatchListItemsSubscription(false); // Reload WatchListItems after user clicks on sort icons
          }
     }

     trackByFn(index: any) { // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
          return index; // or item.id
     }

     updateWatchList(currWatchList: IWatchList) {
          let params = new HttpParams();
          params = params.append('WatchListID',currWatchList?.WatchListID);
          params = params.append('WatchListItemID',currWatchList?.WatchListItemID);
          params = params.append('StartDate',String(currWatchList?.StartDate));

          if (currWatchList.EndDate !== null && String(currWatchList.EndDate) !== '') {
               params = params.append('EndDate',String(currWatchList.EndDate));
          }

          if (currWatchList.Season !== null) {
               params = params.append('Season',currWatchList.Season);
          }

          if (currWatchList.WatchListSourceID !==  null) {
               params = params.append('WatchListSourceID',currWatchList.WatchListSourceID);
          }

          if (currWatchList.Rating !== null) {
               params = params.append('Rating',currWatchList.Rating);
          }

          if (currWatchList.Notes !== null && currWatchList.Notes !== '') {
               params = params.append('Notes',currWatchList.Notes);
          }

          return this.runRest(`/UpdateWatchList`,'PUT',params);
     }

     updateWatchListItem(currWatchListItem: IWatchListItem) {
          let params = new HttpParams();

          params = params.append('WatchListItemID',currWatchListItem.WatchListItemID);
          params = params.append('WatchListItemName',currWatchListItem.WatchListItemName);
          params = params.append('WatchListTypeID',currWatchListItem.WatchListTypeID);
          params = params.append('IMDB_URL',currWatchListItem.IMDB_URL);
          params = params.append('IMDB_Poster',currWatchListItem.IMDB_Poster);
          params = params.append('ItemNotes',currWatchListItem.ItemNotes);

          return this.runRest(`/UpdateWatchListItem`,'PUT',params);
     }

     updateWatchListQueueItem(currWatchListQueueItem: IWatchListQueueItem) {
          let params = new HttpParams();
          params = params.append('WatchListQueueItemID',currWatchListQueueItem.WatchListQueueItemID);
          params = params.append('WatchListItemID',currWatchListQueueItem.WatchListItemID);

          if (currWatchListQueueItem.Notes !== null && currWatchListQueueItem.Notes !== '') {
               params = params.append('Notes',currWatchListQueueItem.Notes);
          }

          return this.runRest(`/UpdateWatchListQueueItem`,'PUT',params);
     }

     watchListItemExists(itemName) {
          for (let i=0;i<this.watchListItems.length;i++) {
               if (this.watchListItems[i].watchListItemName === itemName) {
                    return true;
               }
          }

          return false;
     }
}
