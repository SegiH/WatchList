import { Component } from '@angular/core';
import { DataService } from '../core/data.service';

@Component({
     selector: 'app-watchlistqueue',
     templateUrl: 'watchlistqueue.page.html',
     styleUrls: ['watchlistqueue.page.scss']
})
export class WatchListQueuePage {
     addQueueItemName = '';     
     addQueueItemNotes= '';

     constructor(public dataService: DataService) { }

     addWatchListQueueItem() {
          this.dataService.isAdding=true;
     }

     cancelAddWatchListQueueItem() {
          this.addQueueItemName = '';
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
          if (this.addQueueItemName === ``) {
               alert(`Please select the name`);
               return;
          }

          const currWatchListQueueItem: any=[];
          currWatchListQueueItem.WatchListItemID=this.addQueueItemName;
          currWatchListQueueItem.Notes=this.addQueueItemNotes;

          this.dataService.addWatchListQueueItem(currWatchListQueueItem).subscribe((response) => {
               this.addQueueItemName = '';
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