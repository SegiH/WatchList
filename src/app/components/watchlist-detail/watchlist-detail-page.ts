import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';
import { DatePipe } from '@angular/common';

@Component({
     selector: 'app-watchlist-detail',
     templateUrl: 'watchlist-detail.page.html',
     styleUrls: ['watchlist-detail.page.scss']
})
export class WatchListDetailPage {
     addItemName = '';
     addItemStartDate = '';
     addItemEndDate = '';
     addItemNotes= '';
     addItemSource = '';
     addSeason = '';

     detailObject:[] = [];
     detailObjectName: string;
     isAdding: boolean;
     isEditing: boolean;

     constructor(private dataService: DataService) { }

     ngDoCheck() {
          this.addItemName = '';
          this.addItemStartDate = '';
          this.addItemEndDate = '';
          this.addItemNotes= '';
          this.addItemSource = '';
          this.addSeason = '';

          this.detailObject=this.dataService.getDetailObject();

          this.detailObjectName=this.dataService.getDetailObjectName();

          const addWatchListItemID=this.dataService.getDetailWatchListItemID();

          if (addWatchListItemID !== null) {
               this.addItemName=addWatchListItemID.toString();
          }

          if (this.dataService.getDetailID() == null) {
               this.isAdding=true;

               // Default start and end date to current date
               const dateStr = new Date().setSeconds(0,0);
               const dt = new Date(dateStr).toISOString().substring(0,10); 
               this.addItemStartDate=dt;
               this.addItemEndDate=dt;
          }  else
               this.isAdding=false;
     }

     // Add Queue item to WatchList Queue and remove from WatchList
     addToWatchListQueue() {
          const currWatchListItem: any=[];
          currWatchListItem.WatchListItemID=this.detailObject['WatchListItemID'];

          const d=new Date();
          const pipe = new DatePipe('en-US');
          const now = Date.now();
          const formattedDate = pipe.transform(now, 'shortDate');
          
          currWatchListItem.StartDate=formattedDate;
          currWatchListItem.WatchListID=this.detailObject['WatchListID']; // Needed so we can delete the watchlist item later

          if (this.detailObject['Notes'] != null && this.detailObject['Notes'] != '')
               currWatchListItem.Notes=this.detailObject['Notes'];
          else
               currWatchListItem.Notes="Added from WatchList";

          this.dataService.confirmDialog(currWatchListItem,"Are you sure that you want to move this item to the WatchList Queue?",this.addToWatchListQueueCallback.bind(this))
     }

     addToWatchListQueueCallback() {
          this.dataService.addWatchListQueueItem(this.detailObject).subscribe((response) => {
               this.deleteWatchListCallback();

               this.dataService.getWatchListSubscription();

               this.dataService.getWatchListQueueSubscription();

               this.dataService.closeOverlay();

               alert("Added to Watch List Queue");
          },
          error => {
               alert(`Error ${error} occurred. Not addded to Watch List QueueQQQ`);
               this.dataService.handleError(error);
          });
     }

     cancelWatchList() {
          if (this.isEditing) {
               this.detailObject["WatchListItemID"]=this.detailObject[`Previous`].WatchListItemID;
               this.detailObject["StartDate"]=this.detailObject[`Previous`].StartDate;
               this.detailObject["EndDate"]=this.detailObject[`Previous`].EndDate;
               this.detailObject["Notes"]=this.detailObject[`Previous`].Notes;

               this.isEditing = false;
          }

          if (this.isAdding) {
               this.isEditing = false;

               this.dataService.closeOverlay();
          }
     }

     deleteWatchList(currWatchList: object) {
          this.dataService.confirmDialog(currWatchList,"Are you sure that you want to delete this item ?",this.deleteWatchListCallback.bind(this))
     }

     deleteWatchListCallback() {
          this.dataService.deleteWatchList(this.detailObject['WatchListID']).subscribe((response) => {
               this.dataService.getWatchListSubscription();
          },
          error => {
               console.log(`An error occurred deleting WatchList Item with ID ${this.detailObject['WatchListID']}`)
          });
     }

     editWatchList() {
          this.isEditing=true;

          this.detailObject[`Previous`]=[];

          Object.assign(this.detailObject[`Previous`], this.detailObject);
     }

     saveWatchList() {
          if (this.isAdding)
               this.saveNewWatchList();

          if (this.isEditing)
               this.saveExistingWatchList();
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

               this.dataService.getWatchListSubscription();

               this.dataService.closeOverlay();

          },
          error => {
               this.dataService.handleError(error);
          });
     }

     saveExistingWatchList() {
          if (this.detailObject[`WatchListID`] === ``) {
               alert(`Please select the name`);
               return;
          }

          if (this.detailObject[`StartDate`] === ``) {
               alert(`Please enter the start date`);
               return;
          }

          this.dataService.updateWatchList(this.detailObject).subscribe((response) => {
               this.detailObject[`Disabled`]=true;

               this.isEditing = false;

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}