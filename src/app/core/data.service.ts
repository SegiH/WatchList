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
     isMobilePlatform = false;
     platform: Platform;
     searchTerm: string = '';
     title: string = '';
     watchList: any;
     watchListItems: any;
     watchListTypes: [];

     constructor(public toastController: ToastController, private http: HttpClient, platform: Platform) {
          this.platform = platform;

          if (this.platform.is('android') || this.platform.is('ios'))
               this.isMobilePlatform=true;
               
          this.getWatchListTypesSubscription();          
     }

     addWatchList(currWatchList: []) {
          let params = new HttpParams();     
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);
          
          if (currWatchList['EndDate'] != null)
               params = params.append('EndDate',currWatchList['EndDate']);

          params = params.append('Notes',currWatchList['Notes']);

          return this.processStep(`/AddWatchList`,params);
     }

     addWatchListItem(currWatchListItem: []) {
          let params = new HttpParams();
          params = params.append('Name',currWatchListItem['Name']);
          params = params.append('Type',currWatchListItem['Type']);
          params = params.append('IMDB_URL',currWatchListItem['IMDB_URL']);

          return this.processStep(`/AddWatchListItem`,params);
     }

     getWatchList(columnName,columnDirection) {
          let params = new HttpParams();

          if (this.searchTerm !== "") {
               params = params.append('SearchTerm',this.searchTerm);
          } else if (columnName != null && columnDirection != null) {
               params = params.append('SortColumn',columnName);
               params = params.append('SortDirection',columnDirection);
          } else {
               params = null;
          }

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

     getWatchListItems(columnName = null,columnDirection=null) {
          let params = new HttpParams();

          if (this.searchTerm !== "") {
               params = params.append('SearchTerm',this.searchTerm);
          } else if (columnName != null && columnDirection != null) {
               params = params.append('SortColumn',columnName);
               params = params.append('SortDirection',columnDirection);
          } else {
               params = null;
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

     updateWatchList(currWatchList: []) {
          let params = new HttpParams();
          params = params.append('WatchListID',currWatchList['WatchListID']);
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('StartDate',currWatchList['StartDate']);
          
          if (currWatchList['EndDate'] != null)
               params = params.append('EndDate',currWatchList['EndDate']);
                              
          params = params.append('Notes',currWatchList['Notes']);

          return this.processStep(`/UpdateWatchList`,params);
     }
     
     updateWatchListItem(currWatchList: []) {
          let params = new HttpParams();
          params = params.append('WatchListItemID',currWatchList['WatchListItemID']);
          params = params.append('WatchListItemName',currWatchList['WatchListItemName']);
          params = params.append('WatchListTypeID',currWatchList['WatchListTypeID']);
          params = params.append('IMDB_URL',currWatchList['IMDB_URL']);

          return this.processStep(`/UpdateWatchListItem`,params);
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
