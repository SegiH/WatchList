import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs/';
import { catchError} from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Injectable({
     providedIn: `root`,
})
export class DataService {
     auth_key=``;
     authGuardDisabled = false;
     backendURL=``;
     detailObjectName: string=null;
     detailID: number=null;
     detailWatchListItemID: number=null;
     IMDBSearchEnabled = false;
     imdb_url_missing = false;
     incompleteFilter = true;
     isIMDBSearchEnabled = false;
     recordLimit = 10;
     searchTerm: string = '';
     sourceFilter: string = '';
     watchList: any;
     watchListItems: any;
     watchListNames: any; // This contains a full, unfiltered copy of watchListItems that is used for the names
     watchListQueue: any;
     watchListSortActiveColumn = 'Name';
     watchListSortColumn = 'Name';
     watchListSortDirection = 'ASC';
     watchListItemsSortActiveColumn = 'Name';
     watchListItemsSortColumn = 'Name';
     watchListItemsSortDirection = 'ASC';
     watchListSources: [];
     watchListTypes: [];

     private readonly watchListColumnSizes = {
          'ID': 1,
          'Name': 2,
          'StartDate': 1,
          'EndDate': 1,
          'Source' : 1,
          'Season' : 1,
          'Notes' : 2,
     }

     private readonly watchListItemsColumnSizes = {
          'ID': 1,
          'Name': 2 ,
          'Type': 1,
          'IMDBURL': 3,
          'Notes' : 2,
     }

     private readonly watchListQueueColumnSizes = {
          'ID': 2,
          'Name': 3,
          'Notes' : 3,
          'Action' : 2,
     }

     private readonly validObjectNames = [
          'WatchList',
          'WatchListItems',
          'WatchListQueue'
     ]

     constructor(public alertController: AlertController, private http: HttpClient, private storage: Storage, public toastController: ToastController, private router: Router) {
          this.getBackendURL();
     }

     addWatchList(currWatchList: []) {
          let params = new HttpParams();     
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);
          
          if (currWatchList['EndDate'] != null && currWatchList['EndDate'] != '')
               params = params.append('EndDate',currWatchList['EndDate']);

          if (currWatchList['WatchListSourceID'] != null && currWatchList['WatchListSourceID'] != '')
               params = params.append('WatchListSourceID',currWatchList['WatchListSourceID']);

          if (currWatchList['Season'] != null && currWatchList['Season'] != '')
               params = params.append('Season',currWatchList['Season']);

          if (currWatchList['Notes'] != null && currWatchList['Notes'] != '')
               params = params.append('Notes',currWatchList['Notes']);

          return this.processStep(`/AddWatchList`,params);
     }

     addWatchListItem(currWatchListItem: []) {
          let params = new HttpParams();
          params = params.append('Name',currWatchListItem['Name']);
          params = params.append('Type',currWatchListItem['Type']);
          
          if (currWatchListItem['IMDB_URL'] != null && currWatchListItem['IMDB_URL'] != '')
               params = params.append('IMDB_URL',currWatchListItem['IMDB_URL']);
          
          if (currWatchListItem['ItemNotes'] != null && currWatchListItem['ItemNotes'] != '')
               params = params.append('ItemNotes',currWatchListItem['Notes']);

          return this.processStep(`/AddWatchListItem`,params);
     }

     addWatchListQueueItem(currWatchList: []) {
          let params = new HttpParams();     
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);

          if (currWatchList['Notes'] != null && currWatchList['Notes'] != '')
               params = params.append('Notes',currWatchList['Notes']);

          return this.processStep(`/AddWatchListQueueItem`,params);
     }

     autoAddWatchListRecord(IMDB_URL = null) {
          const ids = this.watchListItems.map(object => {
               return object.WatchListItemID;
          });

          const newID = Math.max(...ids) + 1;
          const existing=this.watchListItems.filter(wli => wli['IMDB_URL'] === IMDB_URL)[0];

          const currWatchList: any=[];
          currWatchList.WatchListItemID=(typeof existing !== 'undefined' ? existing.WatchListItemID : newID);

          this.confirmDialog(currWatchList,"Do you want to add a Watchlist record now ?",this.showWatchListDetail.bind(this));
     }

     closeOverlay() {
          this.router.navigateByUrl(`/tabs/${this.detailObjectName}`);

          this.detailObjectName=null;

          this.detailID=null;
     }

     async confirmDialog(param: object, message: string, callback: any) {
          const alert = await this.alertController.create({
               header: 'Alert',
               message: message,
               buttons: ['OK','Cancel']
          });

          this.authGuardDisabled=true;
    
          await alert.present();
    
          const { role } = await alert.onDidDismiss();

          if (role != "cancel" ) { // OK
               callback(param);
          } else {
               //this.authGuardDisabled=false;
          }
     }

     deleteWatchList(watchListID: string) {
          let params = new HttpParams();

          params = params.append('WatchListID',watchListID);

          return this.processStep(`/DeleteWatchList`,params);
     }

     deleteWatchListItem(watchListItemID: string) {
          let params = new HttpParams();

          params = params.append('WatchListItemID',watchListItemID);

          return this.processStep(`/DeleteWatchListItem`,params);
     }

     deleteWatchListQueueItem(watchListItemID: string) {
          let params = new HttpParams();

          params = params.append('WatchListQueueItemID',watchListItemID);

          return this.processStep(`/DeleteWatchListQueueItem`,params);
     }

     async getAuthKey() {
          await this.storage.create();

          this.auth_key = await this.storage.get('AuthKey');

          if (this.auth_key == null || this.auth_key == '')
               alert("Please set the Auth Key");
          else {
               this.getIMDBSearchEnabledSubscription();

               this.getWatchListItemsSubscription(false);

               this.getWatchListSubscription();

               this.getWatchListQueueSubscription();

               this.getWatchListTypesSubscription();

               this.getWatchListSourcesSubscription();
          }
     }

     async getBackendURL() {
          await this.storage.create();

          this.backendURL = await this.storage.get('BackEndURL');
          
          if (this.backendURL != null && this.backendURL != "") {
               this.getAuthKey();
          } else {
               alert("Please set the backend URL");
          }
     }

     getColumnSize(columnName: string, component: string) {
          if (component == "WatchList")
               return this.watchListColumnSizes[columnName];
          else if (component == "WatchListItems")
               return this.watchListItemsColumnSizes[columnName];
          else if (component == "WatchListQueueItems")
               return this.watchListQueueColumnSizes[columnName];
     }

     getDetailID() {
          return this.detailID;
     }

     getDetailObject() {
          if (this.detailObjectName === null)
               return null;
     
          switch(this.detailObjectName) {
               case "watchlist":
                    return this.watchList.filter(wl => wl['WatchListID'] === this.detailID)[0];
               case "watchlist-items":
                    return this.watchListItems.filter(wli => wli['WatchListItemID'] === this.detailID)[0];
               case "watchlist-queue":
                    return this.watchListQueue.filter(wlq => wlq['WatchListQueueItemID'] === this.detailID)[0];
          } 
     }

     getDetailObjectName() {
          return this.detailObjectName;
     }

     getDetailWatchListItemID() {
          return this.detailWatchListItemID;
     }

     getIMDBSearchEnabled() {
          return this.processStep(`/IsIMDBSearchEnabled`,null);
     }     

     getIMDBSearchEnabledSubscription() {
          this.getIMDBSearchEnabled().subscribe((response) => {
               this.isIMDBSearchEnabled=response;
          },
          error => {
               this.handleError(error);
          });
     }

     getIMDBURL(watchListItemID: number) {
          if (this.getWatchListItemName.length == 0)
               return;

          try {
               for (let i=0;i<this.watchListNames.length;i++) {
                    if (this.watchListNames[i].WatchListItemID == watchListItemID && this.watchListNames[i].IMDB_URL !== null)
                         return this.watchListNames[i].IMDB_URL;
               }
          } catch(e) {
               return null;
          }

          return null;
     }

     getSourceName(ID: number) {
          try {
               return this.watchListSources.filter(wls => wls['WatchListSourceID'] === ID)[0]['WatchListSourceName'];
          } catch(e) {
               return "";
          }
     }

     getWatchList() {
          let params = new HttpParams();

          if (this.searchTerm != null && this.searchTerm !== "") {
               params = params.append('SearchTerm',this.searchTerm);
          }

          if (this.watchListSortColumn != null && this.watchListSortDirection != null) {
               params = params.append('SortColumn',this.watchListSortColumn);
               params = params.append('SortDirection', this.watchListSortDirection);
          }

          if (this.recordLimit != null)
               params = params.append('RecordLimit',this.recordLimit);

          if (this.sourceFilter != null && this.sourceFilter != '' && this.sourceFilter != 'All')
               params = params.append('SourceFilter',this.sourceFilter);

          if (this.incompleteFilter == true)
               params = params.append('IncompleteFilter',true);

          return this.processStep(`/GetWatchList`,params);
     }

     getWatchListItemName(watchListItemID: number) {
          try {
               for (let i=0;i<this.watchListNames.length;i++) {
                    if (this.watchListNames[i].WatchListItemID == watchListItemID)
                         return this.watchListNames[i].WatchListItemName;
               }
          } catch(e) {
               return null;
          }

          return null;
     }

     getWatchListItems(loadAllData: boolean) {
          let params = new HttpParams();

          if (this.watchListNames != null && loadAllData != true) { // If watchListNames is not set get all data and ignore any filters that limit the data set returned
               if (this.recordLimit != null)
                    params = params.append('RecordLimit',this.recordLimit);

               if (this.searchTerm != null && this.searchTerm !== '')
                    params = params.append('SearchTerm',this.searchTerm);
          
               if (this.imdb_url_missing == true)
                    params = params.append('IMDBURLMissing',true);
          }          

          if (this.watchListSortColumn != null && this.watchListSortDirection != null) {
               params = params.append('SortColumn',this.watchListItemsSortColumn);
               params = params.append('SortDirection', this.watchListItemsSortDirection);
          }

          return this.processStep(`/GetWatchListItems`,params);
     }

     getWatchListItemsSubscription(loadAllData: boolean) {
          this.getWatchListItems(loadAllData).subscribe((response) => {               
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.watchListItems=response;

               if (this.watchListNames == null || loadAllData == true) {
                    this.watchListNames = response;
               }
          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListMovieStats() {
          return this.processStep(`/GetWatchListMovieStats`,null);          
     }

     getWatchListQueue() {
          let params = new HttpParams();

          if (this.searchTerm != null && this.searchTerm !== "") {
               params = params.append('SearchTerm',this.searchTerm);
          }

          return this.processStep(`/GetWatchListQueue`,params);
     }

     getWatchListQueueSubscription() {
          this.getWatchListQueue().subscribe((response) => {      
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.watchListQueue=response;
          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListSources() {
          return this.processStep(`/GetWatchListSources`,null);
     }

     getWatchListSourcesSubscription() {
          this.getWatchListSources().subscribe((response) => {
               this.watchListSources=response;
          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListSubscription() {
          this.getWatchList().subscribe((response) => {
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.watchList=response;              

          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListTVStats() {
          return this.processStep(`/GetWatchListTVStats`,null);
     }

     getWatchListTypeName(watchListTypeID) {
          const typeObj=this.watchListTypes.filter(wlt => wlt['WatchListTypeID'] == watchListTypeID)[0];

          if (typeObj !== null) {
               return typeObj["WatchListTypeName"];
          } else
               return null;
     }

     getWatchListTypeNameByWatchListItemID(watchListItemID: string) {
          if (watchListItemID === "") {
               return;
          }

          // If watchListItems or watchListTypes are not loaded, this will throw an error
          try {
               // Get type of current watchlist item ID
               const currentWatchListItem=this.watchListItems.filter(wli => wli['WatchListItemID'].toString() === watchListItemID.toString())[0];

               if (currentWatchListItem !== null) {
                    const typeObj=this.watchListTypes.filter(wlt => wlt['WatchListTypeID'] == currentWatchListItem.WatchListTypeID)[0];

                    if (typeObj !== null) {
                         return typeObj["WatchListTypeName"];
                    } else
                         return null;
               } else
                    return null;
               } catch(e) {
          }
     }

     getWatchListTypes() {
          return this.processStep(`/GetWatchListTypes`,null);          
     }

     getWatchListTypesSubscription() {
          this.getWatchListTypes().subscribe((response) => {
               this.watchListTypes=response;
          },
          error => {
               this.handleError(error);
          });
     }

     handleError(error: Response | any) {
          if (error.error == "Unauthorized") {
                    console.log("Unauthorized. Check the Auth Key");
          } else if (error.error instanceof Error) {
               const errMessage = error.error.message;

               return throwError(errMessage);
               // Use the following instead if using lite-server
               // return Observable.throw(err.text() || 'backend server error');
          }

          return throwError(error || 'Node.js server error');
     }     

     isAuthKeySet() {
          return (this.auth_key != null && this.auth_key != '' ? true : false)
     }

     isBackendURLSet() {
          return (this.backendURL != null && this.backendURL != '' ? true : false)
     }

     openDetailOverlay(objectName: string, ID: number, WatchListItemID: number=null) {
          if (this.detailObjectName !== null) { // Ignore because overlay is already open
               return;
          }

          if (objectName === null) {
               alert(`objectName not provided`);
               return;
          }

          if (this.validObjectNames[objectName] === null) {
               alert(`Invalid objectName ${objectName}`);
               return;
          }

          this.detailObjectName=objectName;
          
          this.detailID=ID;

          this.detailWatchListItemID=WatchListItemID;

          this.router.navigate(['/tabs/detail-overlay',{ "ObjectName" : objectName}]);
     }

     processStep(path: string, params: HttpParams): Observable<any> {
        if (params == null)
             params = new HttpParams();

        params = params.append('auth_key',this.auth_key)

        return this.http.get<any>(this.backendURL + path, {params})
             .pipe(
                  catchError(this.handleError)
             );
     }

     pullToRefresh(event: any, component: string) {
          setTimeout(() => {
               if (component == "WatchList") {
                    this.getWatchList().subscribe((response) => {
                         if (response != null)
                              for (let i=0;i<response.length;i++)
                                   response[i].Disabled = true;

                         this.watchList = response;

                         event.target.complete();
                    },
                    error => {     
                         alert(`An error occurred getting the Watchlist ${error}`);
                    });
               } else if (component == "WatchListItems") {
                    this.getWatchListItems(true).subscribe((response) => {
                         if (response != null)
                              for (let i=0;i<response.length;i++)
                                   response[i].Disabled = true;

                         this.watchListItems=response;

                         event.target.complete();
                    },
                    error => {    
                         alert(`An error occurred getting the Watchlist Items ${error}`);   
                    });
               } else if (component == "WatchListQueueItems") {
                    this.getWatchListQueue().subscribe((response) => {
                         if (response != null)
                              for (let i=0;i<response.length;i++)
                                   response[i].Disabled = true;

                         this.watchListQueue=response;

                         event.target.complete();
                    },
                    error => {       
                         alert(`An error occurred getting the Watchlist Queue ${error}`);
                    });
               }
          }, 2000);
     }

     searchIMDB(searchTerm: string) {
          let params = new HttpParams();

          if (searchTerm !== "") {
               params = params.append('SearchTerm',searchTerm);
          }

          return this.processStep(`/SearchIMDB`,params);
     }

     async setAuthKey() {
          if (this.auth_key != null && this.auth_key != "") {
               await this.storage.set('AuthKey', this.auth_key);
          } else {
              await this.storage.remove('AuthKey');

              this.watchList = [];
              this.watchListItems = [];
              this.watchListSources = [];
              this.watchListTypes =[];
          }
     }

     async setBackendURL() {
          if (this.backendURL != null && this.backendURL != "") {
               await this.storage.set('BackEndURL', this.backendURL);

               this.setAuthKey();
          } else {
              await this.storage.remove('BackEndURL');

              this.watchList = [];
              this.watchListItems = [];
              this.watchListSources = [];
              this.watchListTypes =[];
          }
     }

     setWatchList(newWatchList: any) {
          this.watchList=newWatchList;
     }

     setWatchListItems(newWatchListItems: any) {
          this.watchListItems=newWatchListItems;
     }

     showWatchListDetail(currWatchList: any) {
          this.openDetailOverlay("watchlist",null,currWatchList.WatchListItemID);
     }

     sortClick(name: string,direction: string, component: string) {
          if (component === "WatchList") {
               this.watchListSortColumn = name;
               this.watchListSortActiveColumn = name;

               if (direction === "ASC")
                    this.watchListSortDirection = "DESC";
               else
                    this.watchListSortDirection = "ASC";

               this.getWatchListSubscription();
          } else if (component === "WatchListItems") {
               this.watchListItemsSortColumn = name;
               this.watchListItemsSortActiveColumn = name;

               if (direction === "ASC")
                    this.watchListItemsSortDirection = "DESC";
               else
                    this.watchListItemsSortDirection = "ASC";

               this.getWatchListItemsSubscription(false);
          }
     }

     trackByFn(index: any) { // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
          return index; // or item.id
     }

     updateWatchList(currWatchList: []) {
          let params = new HttpParams();
          params = params.append('WatchListID',currWatchList['WatchListID']);
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);

          if (currWatchList['EndDate'] != null && currWatchList['EndDate'] != '')
               params = params.append('EndDate',currWatchList['EndDate']);

          if (currWatchList['Season'] != null)
               params = params.append('Season',currWatchList['Season']);

          if (currWatchList['WatchListSourceID'] !=  null && currWatchList['WatchListSourceID'] != '')
               params = params.append('WatchListSourceID',currWatchList['WatchListSourceID']);

          if (currWatchList['Notes'] != null && currWatchList['Notes'] != '')
               params = params.append('Notes',currWatchList['Notes']);

          return this.processStep(`/UpdateWatchList`,params);
     }
     
     updateWatchListItem(currWatchListItem: []) {
          let params = new HttpParams();
          params = params.append('WatchListItemID',currWatchListItem['WatchListItemID']);
          params = params.append('WatchListItemName',currWatchListItem['WatchListItemName']);
          params = params.append('WatchListTypeID',currWatchListItem['WatchListTypeID']);          
          
          if (currWatchListItem['IMDB_URL'] != null && currWatchListItem['IMDB_URL'] != '')
               params = params.append('IMDB_URL',currWatchListItem['IMDB_URL']);

          if (currWatchListItem['ItemNotes'] != null && currWatchListItem['ItemNotes'] != '')
               params = params.append('ItemNotes',currWatchListItem['ItemNotes']);

          return this.processStep(`/UpdateWatchListItem`,params);
     }

     updateWatchListQueueItem(currWatchListQueueItem: []) {
          let params = new HttpParams();
          params = params.append('WatchListQueueItemID',currWatchListQueueItem['WatchListQueueItemID']);
          params = params.append('WatchListItemID',currWatchListQueueItem['WatchListItemID']);

          if (currWatchListQueueItem['Notes'] != null && currWatchListQueueItem['Notes'] != '')
               params = params.append('Notes',currWatchListQueueItem['Notes']);

          return this.processStep(`/UpdateWatchListQueueItem`,params);
     }

     watchListItemExists(itemName) {
          for (let i=0;i<this.watchListItems.length;i++) {
               if (this.watchListItems[i]['WatchListItemName'] === itemName) {                    
                    return true;
               }
          }

          return false;
     }
}
