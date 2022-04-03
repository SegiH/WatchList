import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';
import { DatePipe } from '@angular/common';

@Component({
     selector: 'app-watchlist-queue-detail',
     templateUrl: 'watchlist-queue-detail.page.html',
     styleUrls: ['watchlist-queue-detail.page.scss']
})
export class WatchListQueueDetailPage {   
     addQueueItemID = '';     
     addQueueItemNotes= '';

     detailObject:[] = [];
     detailObjectName: string;
     isAdding: boolean;
     isEditing: boolean;

     constructor(private dataService: DataService) {
     }

     ngDoCheck() {
          this.detailObject=this.dataService.getDetailObject();

          this.detailObjectName=this.dataService.getDetailObjectName();

          if (this.dataService.getDetailID() == null)
               this.isAdding=true;
     }

     // Add Queue item to WatchList and remove from WatchList Queue
     addToWatchList() {
          const currWatchListItem: any=[];
          currWatchListItem.WatchListItemID=this.detailObject['WatchListItemID'];

          const d=new Date();
          const pipe = new DatePipe('en-US');
          const now = Date.now();
          const formattedDate = pipe.transform(now, 'shortDate');
          
          currWatchListItem.StartDate=formattedDate;
          currWatchListItem.WatchListQueueItemID=this.detailObject['WatchListQueueItemID']; // Needed so we can delete the queue item later
          
          if (this.detailObject['Notes'] != null && this.detailObject['Notes'] != '')
               currWatchListItem.Notes=this.detailObject['Notes'];
          else
               currWatchListItem.Notes="Added from queue";

          this.dataService.confirmDialog(currWatchListItem,"Are you sure that you want to move this item to the WatchList ?",this.addToWatchListCallback.bind(this))
     }

     addToWatchListCallback() {
          this.dataService.addWatchList(this.detailObject).subscribe((response) => {
               
               this.deleteWatchListQueueItemCallback();

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     cancelWatchListQueueItem() {
          if (this.isEditing) {
               this.detailObject["WatchListItemName"]=this.detailObject[`Previous`].WatchListItemName;
               this.detailObject["Notes"]=this.detailObject[`Previous`].Notes;

               this.isEditing = false;
          } else if (this.isAdding) {
               this.addQueueItemID = '';
               this.addQueueItemNotes= '';

               this.isAdding=false;

               this.dataService.closeOverlay();
          }
     }

     deleteWatchListQueueItem() {
          this.dataService.confirmDialog(this.detailObject,"Are you sure that you want to delete this queue item ?",this.deleteWatchListQueueItemCallback.bind(this))
     }
     
     deleteWatchListQueueItemCallback() {          
          this.dataService.deleteWatchListQueueItem(this.detailObject['WatchListQueueItemID']).subscribe((response) => {
               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               console.log(`An error occurred deleting WatchList Queue Item with ID ${this.detailObject['WatchListQueueItemID']}`)
          });
     }

     editWatchListQueueItem() {
          this.isEditing = true;

          this.detailObject[`Previous`]=[];

          Object.assign(this.detailObject[`Previous`], this.detailObject);
     }

     saveWatchListQueueItem() {
          if (this.isAdding)
               this.saveNewWatchListQueueItem();

          if (this.isEditing)
               this.saveExistingWatchListQueueItem();
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

               this.isAdding=false;

               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     saveExistingWatchListQueueItem() {
          if (this.detailObject[`WatchListItemName`] === ``) {
               alert(`Please select the name`);
               return;
          }

          this.dataService.updateWatchListQueueItem(this.detailObject).subscribe((response) => {
               this.isEditing = false;

               this.dataService.getWatchListQueueSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}