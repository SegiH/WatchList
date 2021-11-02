import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs/';
import { catchError} from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
//import { Storage } from '@ionic/storage';

@Injectable({
     providedIn: `root`,
})
export class DataService {
     readonly backendURL=`https://watchlist-backend.hovav.org`;
     isAdding = false;
     isEditing = false;
     isMobilePlatform = false;
     platform: Platform;
     recordLimit = 10;
     searchTerm: string = '';
     watchList: any;
     watchListItems: any;
     watchListSources: [];
     watchListTypes: [];
     

     constructor(public toastController: ToastController, private http: HttpClient, platform: Platform) {
          this.platform = platform;

          if (this.platform.is('android') || this.platform.is('ios'))
               this.isMobilePlatform=true;
               
          this.getWatchListTypesSubscription();

          this.getWatchListSourcesSubscription();
     }

     addWatchList(currWatchList: []) {
          let params = new HttpParams();     
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);
          params = params.append('Notes',currWatchList['Notes']);

          if (currWatchList['EndDate'] != null)
               params = params.append('EndDate',currWatchList['EndDate']);

          if (currWatchList['WatchListSourceID'] != null)
               params = params.append('WatchListSourceID',currWatchList['WatchListSourceID']);

          if (currWatchList['Season'] != null)
               params = params.append('Season',currWatchList['Season']);

          return this.processStep(`/AddWatchList`,params);
     }

     addWatchListItem(currWatchListItem: []) {
          let params = new HttpParams();
          params = params.append('Name',currWatchListItem['Name']);
          params = params.append('Type',currWatchListItem['Type']);
          params = params.append('IMDB_URL',currWatchListItem['IMDB_URL']);
          params = params.append('Notes',currWatchListItem['Notes']);

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

     getIMDBURL(watchListItemID) {
          for (let i=0;i<this.watchListItems.length;i++) {
               if (this.watchListItems[i].WatchListItemID == watchListItemID && this.watchListItems[i].IMDB_URL !== null)
                    return this.watchListItems[i].IMDB_URL;
          }

          return null;
     }

     getWatchList(columnName,columnDirection) {
          let params = new HttpParams();

          if (this.searchTerm !== "") {
               params = params.append('SearchTerm',this.searchTerm);
          } 
          
          if (columnName != null && columnDirection != null) {
               params = params.append('SortColumn',columnName);
               params = params.append('SortDirection',columnDirection);
          }

          if (this.recordLimit != null)
               params = params.append('RecordLimit',this.recordLimit);

          return this.processStep(`/GetWatchList`,params);
     }

     getWatchListSubscription(columnName,columnDirection) {
          this.getWatchList(columnName,columnDirection).subscribe((response) => {
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.watchList=response;              

          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListItems(columnName,columnDirection) {
          let params = new HttpParams();

          if (this.searchTerm !== "") {
               params = params.append('SearchTerm',this.searchTerm);
          }
          
          if (columnName != null && columnDirection != null) {
               params = params.append('SortColumn',columnName);
               params = params.append('SortDirection',columnDirection);
          }

          return this.processStep(`/GetWatchListItems`,params);
     }
     
     getWatchListItemsSubscription(columnName,columnDirection) {
          this.getWatchListItems(columnName,columnDirection).subscribe((response) => {               
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.watchListItems=response;

               this.getWatchListSubscription(columnName,columnDirection);
          },
          error => {
               this.handleError(error);
          });
     }

     getWatchListItemName(watchListItemID) {
          for (let i=0;i<this.watchListItems.length;i++) {
               if (this.watchListItems[i].WatchListItemID == watchListItemID)
                    return this.watchListItems[i].WatchListItemName;
          }

          return null;
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

     getWatchListTypes() {
          return this.processStep(`/GetWatchListTypes`,null);          
     }

     getWatchListTypesSubscription() {
          this.getWatchListTypes().subscribe((response) => {
               this.watchListTypes=response;              

               this.getWatchListItemsSubscription(null,null);
          },
          error => {
               this.handleError(error);
          });
     }

     processStep(path: string, params: HttpParams): Observable<any> {
        return this.http.get<any>(this.backendURL + path, {params})
             .pipe(
                  catchError(this.handleError)
             );
     }

     setWatchlist(newWatchList: any) {
          this.watchList=newWatchList;
     }

     setWatchlistItems(newWatchListItems: any) {
          this.watchListItems=newWatchListItems;
     }

     updateWatchList(currWatchList: []) {
          let params = new HttpParams();
          params = params.append('WatchListID',currWatchList['WatchListID']);
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);

          if (currWatchList['EndDate'] != null)
               params = params.append('EndDate',currWatchList['EndDate']);

          if (currWatchList['Season'] != null)
               params = params.append('Season',currWatchList['Season']);

          if (currWatchList['WatchListSourceID'] != null)
               params = params.append('WatchListSourceID',currWatchList['WatchListSourceID']);

          if (currWatchList['Notes'] != null)
               params = params.append('Notes',currWatchList['Notes']);

          return this.processStep(`/UpdateWatchList`,params);
     }
     
     updateWatchListItem(currWatchList: []) {
          let params = new HttpParams();
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('WatchListItemName',currWatchList['WatchListItemName']);
          params = params.append('WatchListTypeID',currWatchList['WatchListTypeID']);          
          params = params.append('IMDB_URL',currWatchList['IMDB_URL']);
          params = params.append('ItemNotes',currWatchList['ItemNotes']);

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

     private handleError(error: Response | any) {
          if (error.error instanceof Error) {
               const errMessage = error.error.message;

               return throwError(errMessage);
               // Use the following instead if using lite-server
               // return Observable.throw(err.text() || 'backend server error');
          }

          return throwError(error || 'Node.js server error');
     }
}
