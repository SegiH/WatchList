import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs/';
import { catchError} from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
     providedIn: `root`,
})
export class DataService {
     backendURL=``;
     imdb_url_missing = false;
     incompleteFilter = true;
     isAdding = false;
     isEditing = false;
     isMobilePlatform = false;
     platform: Platform;
     recordLimit = 10;
     searchTerm: string = '';
     sourceFilter: string = '';
     watchList: any;
     watchListItems: any;
     watchListNames: any; // This contains a full, unfiltered copy of watchListItems that is used for the names     
     watchListSources: [];     
     watchListTypes: [];

     readonly watchListColumnSizes = {
          'ID': 1,
          'Name': 1,
          'StartDate': 1,
          'EndDate': 1,
          'Source' : 2,
          'Season' : 1,
          'Notes' : 2,
          'Action' : 1,
     }

     readonly watchListItemsColumnSizes = {
          'ID': 2,
          'Name': 1,
          'Type': 2,
          'IMDBURL': 2,
          'Notes' : 2,
          'Action' : 2,
     }

     watchListSortActiveColumn = 'Name';
     watchListSortColumn = 'Name';
     watchListSortDirection = 'ASC';

     watchListItemsSortActiveColumn = 'Name';
     watchListItemsSortColumn = 'Name';
     watchListItemsSortDirection = 'ASC';
     
     constructor(public toastController: ToastController, private http: HttpClient, platform: Platform, private storage: Storage) {
          this.platform = platform;

          if (this.platform.is('android') || this.platform.is('ios'))
               this.isMobilePlatform=true;
          
          this.getBackendURL(); // Get Saved backend URL;
     }

     addWatchList(currWatchList: []) {
          let params = new HttpParams();     
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);
          
          if (currWatchList['EndDate'] != '')
               params = params.append('EndDate',currWatchList['EndDate']);

          if (currWatchList['WatchListSourceID'] != '')
               params = params.append('WatchListSourceID',currWatchList['WatchListSourceID']);

          if (currWatchList['Season'] != '')
               params = params.append('Season',currWatchList['Season']);

          if (currWatchList['Notes'] != '')
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

     deleteWatchList(watchListID) {
          let params = new HttpParams();

          params = params.append('WatchListID',watchListID);

          return this.processStep(`/DeleteWatchList`,params);
     }

     deleteWatchListItem(watchListItemID) {
          let params = new HttpParams();

          params = params.append('WatchListItemID',watchListItemID);

          return this.processStep(`/DeleteWatchListItem`,params);
     }

     async getBackendURL() {
          await this.storage.create();

          this.backendURL = await this.storage.get('BackEndURL');
          
          if (this.backendURL != null && this.backendURL != "") {
               this.getWatchListItemsSubscription();

               this.getWatchListTypesSubscription();

               this.getWatchListSourcesSubscription();
          } else {
               alert("Please set the backend URL");
          }
     }

     getColumnSize(columnName, component: string) {
          if (component == "WatchList")
               return this.watchListColumnSizes[columnName];
          else if (component == "WatchListItems")
               return this.watchListItemsColumnSizes[columnName];
     }

     getIMDBURL(watchListItemID) {
          for (let i=0;i<this.watchListNames.length;i++) {
               if (this.watchListNames[i].WatchListItemID == watchListItemID && this.watchListNames[i].IMDB_URL !== null)
                    return this.watchListNames[i].IMDB_URL;
          }

          return null;
     }

     getWatchList() {
          let params = new HttpParams();

          if (this.searchTerm !== "") {
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

     getWatchListItems() {
          let params = new HttpParams();

          if (this.watchListNames != null) { // If watchListNames is not set get all data and ignore any filters that limit the data set returned
               if (this.recordLimit != null)
                    params = params.append('RecordLimit',this.recordLimit);

               if (this.searchTerm !== '')
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
     
     getWatchListItemsSubscription() {
          this.getWatchListItems().subscribe((response) => {
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.watchListItems=response;

               if (this.watchListNames == null) {
                    this.watchListNames = response;
               }

               this.getWatchListSubscription();
          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListItemName(watchListItemID) {
          for (let i=0;i<this.watchListNames.length;i++) {
               if (this.watchListNames[i].WatchListItemID == watchListItemID)
                    return this.watchListNames[i].WatchListItemName;
          }

          return null;
     }

     getWatchListMovieStats() {
          return this.processStep(`/GetWatchListMovieStats`,null);          
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

     getWatchListTVStats() {
          return this.processStep(`/GetWatchListTVStats`,null);          
     }

     getWatchListTypes() {
          return this.processStep(`/GetWatchListTypes`,null);          
     }

     getWatchListTypesSubscription() {
          this.getWatchListTypes().subscribe((response) => {
               this.watchListTypes=response;              

               this.getWatchListItemsSubscription();
          },
          error => {
               this.handleError(error);
          });
     }

     handleError(error: Response | any) {
          if (error.error instanceof Error) {
               const errMessage = error.error.message;

               return throwError(errMessage);
               // Use the following instead if using lite-server
               // return Observable.throw(err.text() || 'backend server error');
          }

          return throwError(error || 'Node.js server error');
     }

     processStep(path: string, params: HttpParams): Observable<any> {
        return this.http.get<any>(this.backendURL + path, {params})
             .pipe(
                  catchError(this.handleError)
             );
     }

     pullToRefresh(event, component: string) {
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
                    });
               } else if (component == "WatchListItems") {
                    this.getWatchListItems().subscribe((response) => {
                         if (response != null)
                              for (let i=0;i<response.length;i++)
                                   response[i].Disabled = true;

                         this.watchListItems=response;

                         event.target.complete();
                    },
                    error => {       
                    });
               }
          }, 2000);
     }

     async setBackendURL() {
          if (this.backendURL != null && this.backendURL != "") {
               await this.storage.set('BackEndURL', this.backendURL);
          } else {
              await this.storage.remove('BackEndURL');

              this.watchList = [];
              this.watchListItems = [];
              this.watchListSources = [];
              this.watchListTypes =[];
          }
            
          if (this.backendURL != null && this.backendURL != "") {
               this.getWatchListTypesSubscription();

               this.getWatchListSourcesSubscription();
          }
     }

     setWatchlist(newWatchList: any) {
          this.watchList=newWatchList;
     }

     setWatchlistItems(newWatchListItems: any) {
          this.watchListItems=newWatchListItems;
     }

     sortClick(name,direction, component: string) {
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

               this.getWatchListItemsSubscription();
          }
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }

     updateWatchList(currWatchList: []) {
          let params = new HttpParams();
          params = params.append('WatchListID',currWatchList['WatchListID']);
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);

          if (currWatchList['EndDate'] != '')
               params = params.append('EndDate',currWatchList['EndDate']);

          if (currWatchList['Season'] != null)
               params = params.append('Season',currWatchList['Season']);

          if (currWatchList['WatchListSourceID'] != '')
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

     watchListItemExists(itemName) {
          for (let i=0;i<this.watchListItems.length;i++) {
               if (this.watchListItems[i]['WatchListItemName'] === itemName) {                    
                    return true;
               }
          }

          return false;
     }
}
