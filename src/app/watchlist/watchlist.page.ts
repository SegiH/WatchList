import { Component } from '@angular/core';
import { DataService } from '../core/data.service';

@Component({
     selector: 'app-watchlist',
     templateUrl: 'watchlist.page.html',
     styleUrls: ['watchlist.page.scss']
})
export class WatchListPage {
     addItemName = '';
     addItemStartDate = '';
     addItemEndDate = '';
     addItemNotes= '';
     addItemSource = '';
     addSeason = '';
     isAdding = false;
     isEditing = false;
     recordLimit = 10;
     sortColumn = 'Name';
     sortDirection = 'ASC';
     sortActiveColumn = 'Name';

     readonly columnSizes = {
          'ID': 1,
          'Name': 1,
          'StartDate': 1,
          'EndDate': 1,
          'Source' : 2,
          'Season' : 1,
          'Notes' : 2,
          'Action' : 1,
     }

     readonly recordLimitOptions = [
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService) {}

     addWatchList() {
          this.isAdding=true;
     }

     cancelAddWatchList() {
          this.addItemName = '';
          this.addItemStartDate = '';
          this.addItemEndDate = '';
          this.addItemNotes= '';

          this.isAdding=false;
     }

     cancelEditWatchList(currWatchList: []) {
          currWatchList["WatchListItemID"]=currWatchList[`Previous`].WatchListItemID;
          currWatchList["StartDate"]=currWatchList[`Previous`].StartDate;
          currWatchList["EndDate"]=currWatchList[`Previous`].EndDate;
          currWatchList["Notes"]=currWatchList[`Previous`].Notes;

          currWatchList[`Disabled`]=true;

          this.isEditing = false;
     }

     doRefresh(event) {
          setTimeout(() => {
               this.dataService.getWatchList(this.sortColumn,this.sortDirection,this.recordLimit).subscribe((response) => {
                    if (response != null)
                         for (let i=0;i<response.length;i++)
                              response[i].Disabled = true;

                    this.dataService.setWatchlist(response);

                    event.target.complete();
               },
                    error => {       
               });
          }, 2000);
     }

     editWatchList(currWatchList: []) {
          currWatchList[`Previous`]=[];
          Object.assign(currWatchList[`Previous`], currWatchList);

          currWatchList[`Disabled`]=false;

          this.isEditing = true;
     }

     handleError(response: Response, error: Error) {}

     recordLimitChanged() {
          this.dataService.getWatchList(this.sortColumn,this.sortDirection,this.recordLimit).subscribe((response) => {
               if (response != null)
                    for (let i=0;i<response.length;i++)
                         response[i].Disabled = true;

               this.dataService.setWatchlist(response);
          },
               error => {       
          });
     }

     saveNewWatchList() {
          if (this.addItemName === ``) {
               alert(`Please select the name`);
               return;
          }

          if (this.addItemStartDate === ``) {
               alert(`Please enter the start date`);
               return;
          }

          const currWatchList: any=[];
          currWatchList.WatchListItemID=this.addItemName;
          currWatchList.StartDate=this.addItemStartDate;
          currWatchList.EndDate=this.addItemEndDate;
          currWatchList.Notes=this.addItemNotes;
          currWatchList.WatchListSourceID=this.addItemSource;
          currWatchList.Season=this.addSeason;

          this.dataService.addWatchList(currWatchList).subscribe((response) => {
               this.addItemName = '';
               this.addItemStartDate = '';
               this.addItemEndDate = '';
               this.addItemNotes= '';
               this.addItemSource = '';
               this.addSeason = '';

               this.isAdding=false;

               this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection,this.recordLimit);
          },
          error => {
               this.handleError(null, error);
          });
     }

     saveWatchList(currWatchList: []) {
          if (currWatchList[`WatchListID`] === ``) {
               alert(`Please select the name`);
               return;
          }

          if (currWatchList[`StartDate`] === ``) {
               alert(`Please enter the start date`);
               return;
          }

          this.dataService.updateWatchList(currWatchList).subscribe((response) => {
               currWatchList[`Disabled`]=true;

               this.isEditing = false;

               this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection,this.recordLimit);
          },
          error => {
               this.handleError(null, error);
          });
     }

     searchFilter() {
          this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection,this.recordLimit);
     }

     sortClick(name,direction) {
          const columnName=(name != null ? name : this.sortColumn);
          const columnDirection=(direction != null ? direction : this.sortDirection);

          this.dataService.getWatchListSubscription(columnName,columnDirection,this.recordLimit);
          
          this.sortActiveColumn=columnName;

          if (direction === "ASC")
               this.sortDirection="DESC";
          else
               this.sortDirection="ASC";
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
