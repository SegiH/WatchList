import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../core/data.service';

@Component({
     selector: 'app-watchlistqueue',
     templateUrl: 'watchlistqueue.page.html',
     styleUrls: ['watchlistqueue.page.scss']
})
export class WatchListQueuePage {
     addQueueItemID = '';     
     addQueueItemNotes= '';

     constructor(public dataService: DataService) { }

     // Add Queue item to WatchList and remove from WatchList Queue
     addToWatchList(currWatchListQueue) {
          const currWatchListItem: any=[];
          currWatchListItem.WatchListItemID=currWatchListQueue.WatchListItemID;

          const d=new Date();
          const pipe = new DatePipe('en-US');
          const now = Date.now();
          const formattedDate = pipe.transform(now, 'shortDate');
          
          currWatchListItem.StartDate=formattedDate;
          currWatchListItem.WatchListQueueItemID=currWatchListQueue.WatchListQueueItemID; // Needed so we can delete the queue item later
          
          if (currWatchListQueue.Notes != null && currWatchListQueue.Notes != '')
               currWatchListItem.Notes=currWatchListQueue.Notes;
          else
               currWatchListItem.Notes="Added from queue";

          this.dataService.confirmDialog(currWatchListItem,"Are you sure that you want to move this item to the WatchList ?",this.addToWatchListCallback.bind(this))
     }

     addToWatchListCallback(currWatchListItem) {
          this.dataService.isAdding=true;

          this.dataService.addWatchList(currWatchListItem).subscribe((response) => {
               
               this.deleteWatchListQueueItemCallback(currWatchListItem);

               this.dataService.isAdding=false;

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     addWatchListQueueItem() {
          this.dataService.isAdding=true;
     }

     cancelAddWatchListQueueItem() {
          this.addQueueItemID = '';
          this.addQueueItemNotes= '';

          this.dataService.isAdding=false;
     }

     cancelEditWatchListQueueItem(currWatchList: []) {
          currWatchList["WatchListItemID"]=currWatchList[`Previous`].WatchListItemID;
          currWatchList["StartDate"]=currWatchList[`Previous`].StartDate;
          currWatchList["EndDate"]=currWatchList[`Previous`].EndDate;
          currWatchList["Notes"]=currWatchList[`Previous`].Notes;

          currWatchList[`Disabled`]=true;

          this.dataService.isEditing = false;
     }

     deleteWatchListQueueItem(currWatchListQueueItem: object) {
          this.dataService.confirmDialog(currWatchListQueueItem,"Are you sure that you want to delete this queue item ?",this.deleteWatchListQueueItemCallback.bind(this))
     }
     
     deleteWatchListQueueItemCallback(currWatchListQueueItem) {          
          this.dataService.deleteWatchListQueueItem(currWatchListQueueItem['WatchListQueueItemID']).subscribe((response) => {
               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               console.log(`An error occurred deleting WatchList Queue Item with ID ${currWatchListQueueItem['WatchListQueueItemID']}`)
          });
     }

     editWatchListQueueItem(currWatchListQueueItem: []) {
          currWatchListQueueItem[`Previous`]=[];

          Object.assign(currWatchListQueueItem[`Previous`], currWatchListQueueItem);

          currWatchListQueueItem[`Disabled`]=false;

          this.dataService.isEditing = true;
     }

     saveNewWatchListQueueItem() {
          if (this.addQueueItemID === ``) {
               alert(`Please select the name`);
               return;
          }

          const currWatchListQueueItem: any=[];
          currWatchListQueueItem.WatchListItemID=this.addQueueItemID;
          currWatchListQueueItem.Notes=this.addQueueItemNotes;

          this.dataService.addWatchListQueueItem(currWatchListQueueItem).subscribe((response) => {
               this.addQueueItemID = '';
               this.addQueueItemNotes= '';

               this.dataService.isAdding=false;

               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     saveWatchListQueueItem(currWatchListQueueItem: []) {
          if (currWatchListQueueItem[`WatchListItemID`] === ``) {
               alert(`Please select the name`);
               return;
          }

          this.dataService.updateWatchListQueueItem(currWatchListQueueItem).subscribe((response) => {
               currWatchListQueueItem[`Disabled`]=true;

               this.dataService.isEditing = false;

               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}