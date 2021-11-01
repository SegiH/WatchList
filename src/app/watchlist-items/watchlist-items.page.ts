import { Component } from '@angular/core';
import { DataService } from '../core/data.service';

@Component({
     selector: 'app-watchlist',
     templateUrl: 'watchlist-items.page.html',
     styleUrls: ['watchlist-items.page.scss']
})
export class WatchListItemsPage {
     addItemName = '';
     addItemIMDBURL = '';
     addItemNotes = '';
     addItemType = '';
     isAdding = false;
     isEditing = false;
     recordLimit = 10;
     sortColumn = 'Name';
     sortDirection = 'DESC';
     sortActiveColumn = 'Name';

     readonly columnSizes = {
          'ID': 2,
          'Name': 1,
          'Type': 2,
          'IMDBURL': 2,
          'Notes' : 2,
          'Action' : 2,
     }

     readonly recordLimitOptions = [
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService) {}

     addWatchListItem() {
          this.isAdding=true;
     }

     cancelAddWatchListItem() {          
          this.addItemName = '';
          this.addItemIMDBURL = '';
          this.addItemType = '';

          this.isAdding=false;
     }

     cancelEditWatchListItem(currWatchListItem: []) {
          currWatchListItem["WatchListItemID"]=currWatchListItem[`Previous`].WatchListItemID;
          currWatchListItem["WatchListTypeID"]=currWatchListItem[`Previous`].WatchListTypeID;
          currWatchListItem["IMDB_URL"]=currWatchListItem[`Previous`].IMDB_URL;

          currWatchListItem[`Disabled`]=true;

          this.isEditing = false;
     }

     doRefresh(event) {
          setTimeout(() => {
               this.dataService.getWatchListItems(this.sortColumn,this.sortDirection,this.recordLimit).subscribe((response) => {
                    if (response != null)
                         for (let i=0;i<response.length;i++)
                              response[i].Disabled = true;

                    this.dataService.setWatchlistItems(response);

                    event.target.complete();
               },
                    error => {       
               });
          }, 2000);
     }

     editWatchListItem(currWatchListItem: []) {
          currWatchListItem[`Previous`]=[];
          Object.assign(currWatchListItem[`Previous`], currWatchListItem);
          
          currWatchListItem[`Disabled`]=false;

          this.isEditing = true;
     }

     handleError(response: Response, error: Error) {}

     saveNewWatchListItem() {
          if (this.addItemName === ``) {
               alert(`Please select the name`);
               return;
          }

          if (this.dataService.watchListItemExists(this.addItemName)) {
               alert("This name already exists");
               return;
          }

          if (this.addItemType === ``) {
               alert(`Please select the type of media`);
               return;
          }

          const currWatchListItem: any=[];
          currWatchListItem.Name=this.addItemName;
          currWatchListItem.Type=this.addItemType;
          currWatchListItem.IMDB_URL=this.addItemIMDBURL;
          currWatchListItem.ItemNotes=this.addItemNotes;

          this.dataService.addWatchListItem(currWatchListItem).subscribe((response) => {
               this.dataService.getWatchListSubscription(this.sortColumn,this.sortDirection,this.recordLimit);

               this.addItemName = '';
               this.addItemType = '';
               this.addItemIMDBURL = '';
               this.addItemNotes = '';

               this.isAdding = false;

               this.dataService.getWatchListItemsSubscription(this.sortColumn,this.sortDirection,this.recordLimit);
          },
          error => {
               this.handleError(null, error);
          });
     }

     recordLimitChanged() {
          this.dataService.getWatchListItemsSubscription(this.sortColumn,this.sortDirection,this.recordLimit);
     }

     saveWatchListItem(currWatchListItem: []) {
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
               currWatchListItem[`Disabled`]=true;

               this.isEditing = false;

               this.dataService.getWatchListItemsSubscription(this.sortColumn,this.sortDirection,this.recordLimit);
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

          this.dataService.getWatchListItemsSubscription(columnName,columnDirection,this.recordLimit);

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
