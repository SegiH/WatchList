import { DatePipe } from '@angular/common';
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
     
     constructor(public dataService: DataService) { }

     addWatchList() {
          this.dataService.isAdding=true;
     }

     // Add Queue item to WatchList Queue and remove from WatchList
     addToWatchListQueue(currWatchList) {
          const currWatchListItem: any=[];
          currWatchListItem.WatchListItemID=currWatchList.WatchListItemID;

          const d=new Date();
          const pipe = new DatePipe('en-US');
          const now = Date.now();
          const formattedDate = pipe.transform(now, 'shortDate');
          
          currWatchListItem.StartDate=formattedDate;
          currWatchListItem.WatchListID=currWatchList.WatchListID; // Needed so we can delete the watchlist item later

          if (currWatchList.Notes != null && currWatchList.Notes != '')
               currWatchListItem.Notes=currWatchList.Notes;
          else
               currWatchListItem.Notes="Added from WatchList";

          this.dataService.confirmDialog(currWatchListItem,"Are you sure that you want to move this item to the WatchList Queue?",this.addToWatchListQueueCallback.bind(this))
     }

     addToWatchListQueueCallback(currWatchListItem) {
          this.dataService.isAdding=true;

          this.dataService.addWatchListQueueItem(currWatchListItem).subscribe((response) => {
               this.deleteWatchListCallback(currWatchListItem);

               this.dataService.isAdding=false;

               this.dataService.getWatchListSubscription();

               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     cancelAddWatchList() {
          this.addItemName = '';
          this.addItemStartDate = '';
          this.addItemEndDate = '';
          this.addItemNotes= '';

          this.dataService.isAdding=false;
     }

     cancelEditWatchList(currWatchList: []) {
          currWatchList["WatchListItemID"]=currWatchList[`Previous`].WatchListItemID;
          currWatchList["StartDate"]=currWatchList[`Previous`].StartDate;
          currWatchList["EndDate"]=currWatchList[`Previous`].EndDate;
          currWatchList["Notes"]=currWatchList[`Previous`].Notes;

          currWatchList[`Disabled`]=true;

          this.dataService.isEditing = false;
     }

     deleteWatchList(currWatchList: object) {
          this.dataService.confirmDialog(currWatchList,"Are you sure that you want to delete this item ?",this.deleteWatchListCallback.bind(this))
     }

     deleteWatchListCallback(currWatchList: object) {
          this.dataService.deleteWatchList(currWatchList['WatchListID']).subscribe((response) => {
               this.dataService.getWatchListSubscription();
          },
          error => {
               console.log(`An error occurred deleting WatchList Item with ID ${currWatchList['WatchListID']}`)
          });
     }

     editWatchList(currWatchList: []) {
          currWatchList[`Previous`]=[];

          Object.assign(currWatchList[`Previous`], currWatchList);

          currWatchList[`Disabled`]=false;

          this.dataService.isEditing = true;
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

               this.dataService.isAdding=false;

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
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

               this.dataService.isEditing = false;

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}
