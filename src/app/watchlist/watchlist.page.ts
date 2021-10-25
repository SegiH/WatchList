// Set app icon
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
     isAdding = false;
     isEditing = false;
     sortColumn = 'Name';
     sortDirection = 'ASC';
     sortActiveColumn = 'Name';

     constructor(public dataService: DataService) {
          this.dataService.title="WatchList";
     }

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

     editWatchList(currWatchList: []) {
          currWatchList[`Previous`]=[];
          Object.assign(currWatchList[`Previous`], currWatchList);

          currWatchList[`Disabled`]=false;

          this.isEditing = true;
     }

     handleError(response: Response, error: Error) {}

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

          this.dataService.addWatchList(currWatchList).subscribe((response) => {
               this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection);
          },
          error => {
               this.handleError(null, error);
          });

          this.addItemName = '';
          this.addItemStartDate = '';
          this.addItemEndDate = '';
          this.addItemNotes= '';

          this.isAdding=false;
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
               this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection);
          },
          error => {
               this.handleError(null, error);
          });

          currWatchList[`Disabled`]=true;

          this.isEditing = false;
     }

     searchFilter() {
          this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection);
     }

     sortClick(name,direction) {
          const columnName=(name != null ? name : this.sortColumn);
          const columnDirection=(direction != null ? direction : this.sortDirection);

          this.dataService.getWatchListSubscription(columnName,columnDirection);
          
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
