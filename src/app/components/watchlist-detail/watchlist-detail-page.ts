import { Component, DoCheck, OnInit } from '@angular/core';
import { DataService } from '../../core/data.service';
import { DatePipe } from '@angular/common';
import IWatchList from 'src/app/interfaces/watchlist.interface';

@Component({
     selector: 'app-watchlist-detail',
     templateUrl: 'watchlist-detail.page.html',
     styleUrls: ['watchlist-detail.page.scss']
})
export class WatchListDetailComponent implements DoCheck {
     addItemID = 0;
     addItemStartDate = '';
     addItemEndDate = '';
     addItemNotes= '';
     addItemSource = '';
     addSeason = '';
     addRating = 0;

     detailObject: IWatchList;
     detailObjectName: string;
     isAdding: boolean;
     isEditing: boolean;
     lastIndex = null;
     lastRating = null;
     readonly math = Math;
     wasModified = false;

     constructor(private dataService: DataService) { }

     ngDoCheck(): void {
          this.detailObject=this.dataService.getDetailObject();

          this.detailObjectName=this.dataService.getDetailObjectName();

          const addWatchListItemID=this.dataService.getDetailWatchListItemID();

          if (this.dataService.getDetailID() == null) {
               this.isAdding=true;

               // Default start date to current date
               //const dateStr = new Date().setSeconds(0,0);
               //const dt = new Date(dateStr).toISOString().substring(0,10);

               //if (this.addItemStartDate === '') {
               //     this.addItemStartDate=dt;
               //}
          }  else
               this.isAdding=false;

          if (addWatchListItemID !== null) {
               this.addItemID=addWatchListItemID;
               this.isAdding=true;

               this.detailObject=this.dataService.iWatchListEmpty();
          }
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

          if (this.detailObject['Notes'] !== null && this.detailObject['Notes'] !== '') {
               currWatchListItem.Notes=this.detailObject['Notes'];
          } else {
               currWatchListItem.Notes='Added from WatchList';
          }

          this.dataService.confirmDialog(currWatchListItem,'Are you sure that you want to move this item to the WatchList Queue?',this.addToWatchListQueueCallback.bind(this));
     }

     addToWatchListQueueCallback() {
          this.dataService.addWatchListQueueItem(this.detailObject).subscribe((response) => {
               this.deleteWatchListCallback();

               this.dataService.getWatchListSubscription();

               this.dataService.getWatchListQueueSubscription();

               this.dataService.closeOverlay();

               this.dataService.alert('Added to Watch List Queue');
          },
          error => {
               this.dataService.alert(`Error ${error} occurred. Not addded to Watch List QueueQQQ`);
               this.dataService.handleError(error);
          });
     }

     cancelWatchList() {
          if (this.isEditing) {
               this.detailObject.WatchListItemID=this.detailObject[`Previous`].WatchListItemID;
               this.detailObject.StartDate=this.detailObject[`Previous`].StartDate;
               this.detailObject.EndDate=this.detailObject[`Previous`].EndDate;
               this.detailObject.WatchListSourceID=this.detailObject[`Previous`].WatchListSourceID;
               this.detailObject.Rating=this.detailObject[`Previous`].Rating;
               this.detailObject.Notes=this.detailObject[`Previous`].Notes;

               this.isEditing = false;
          }

          if (this.isAdding) {
               this.isEditing = false;

               this.addItemID=0;

               this.dataService.closeOverlay();
          }
     }

     closeClickHandler() {
          if (this.wasModified)
               this.dataService.getWatchListSubscription();

          this.dataService.closeOverlay();
     }

     deleteWatchList(currWatchList: object) {
          this.dataService.confirmDialog(currWatchList,'Are you sure that you want to delete this item ?',this.deleteWatchListCallback.bind(this));
     }

     deleteWatchListCallback() {
          this.dataService.deleteWatchList(this.detailObject['WatchListID']).subscribe((response) => {
               this.dataService.closeOverlay();
               
               this.dataService.getWatchListSubscription();
          },
          error => {
               console.log(`An error occurred deleting WatchList Item with ID ${this.detailObject['WatchListID']}`);
          });
     }

     editWatchList() {
          this.isEditing=true;

          this.detailObject[`Previous`]=[];

          Object.assign(this.detailObject[`Previous`], this.detailObject);
     }

     getRatingIcon(index: number) {
          if (this.isAdding)
               return this.addRating > index + 0.5 ? "heart" : this.addRating === index + 0.5 ? "heart-half" : "heart-outline";
          else
               return this.detailObject?.Rating > index + 0.5 ? "heart" : this.detailObject?.Rating === index + 0.5 ? "heart-half" : "heart-outline"
     }

     numSequence(n: number): Array<number> {
          return Array(n);
     }

     ratingClickHandler(index: number) {
          if (!this.isAdding && !this.isEditing)
               return true;

          if (this.isAdding) {
               if (String(this.addRating + ".0") === String(index + ".0")) {
                    this.addRating = index + 0.5;
               } else if (String(this.addRating) === String(index + ".5")) {
                    this.addRating = parseFloat((index+1).toFixed(1));
               } else {
                    this.addRating = parseFloat(index.toFixed(1));
               }

               return;
          } else {
               if (this.detailObject.Rating === null)
                    this.detailObject.Rating=0;

               if (String(this.detailObject.Rating + ".0") === String(index + ".0")) {
                    this.detailObject.Rating = index + 0.5;
               } else if (String(this.detailObject.Rating) === String(index + ".5")) {
                    this.detailObject.Rating = parseFloat((index+1).toFixed(1));
               } else {
                    this.detailObject.Rating = parseFloat(index.toFixed(1));
               }
          }
     }

     saveWatchList() {
          if (this.isAdding) {
               this.saveNewWatchList();
          }

          if (this.isEditing) {
               this.saveExistingWatchList();
          }
     }

     saveNewWatchList() {
          if (this.addItemID === 0) {
               this.dataService.alert(`Please select the name`);
               return;
          }

          if (this.addItemStartDate === ``) {
               this.dataService.alert(`Please enter the start date`);
               return;
          }

          const currWatchList: any=[];
          currWatchList.WatchListItemID=this.addItemID;
          currWatchList.StartDate=this.addItemStartDate;
          currWatchList.EndDate=this.addItemEndDate;
          currWatchList.Notes=this.addItemNotes;
          currWatchList.WatchListSourceID=this.addItemSource;
          currWatchList.Season=this.addSeason;

          // Clear fields to prevent user from saving twice
          this.addItemID = 0;
          this.addItemStartDate = '';
          this.addItemEndDate = '';
          this.addItemNotes= '';
          this.addItemSource = '';
          this.addSeason = '';

          this.dataService.addWatchList(currWatchList).subscribe((response) => {
               this.addItemID = 0;
               this.addItemStartDate = '';
               this.addItemEndDate = '';
               this.addItemNotes= '';
               this.addItemSource = '';
               this.addSeason = '';
               this.addRating = 0;

               this.isAdding=false;

               this.wasModified = true;

               this.dataService.getWatchListSubscription();

               this.dataService.closeOverlay();
          },
          error => {
               // Restore fields values in case the user made a mistake & wants to resubmit
               this.addItemID = currWatchList.WatchListItemID;
               this.addItemStartDate = currWatchList.StartDate;
               this.addItemEndDate = currWatchList.EndDate;
               this.addItemNotes= currWatchList.Notes;
               this.addItemSource = currWatchList.WatchListSourceID;
               this.addSeason = currWatchList.Season;
               
               this.dataService.handleError(error);
          });
     }

     saveExistingWatchList() {
          if (String(this.detailObject[`WatchListID`]) === ``) {
               this.dataService.alert(`Please select the name`);
               return;
          }

          if (String(this.detailObject[`StartDate`]) === ``) {
               this.dataService.alert(`Please enter the start date`);
               return;
          }

          if (isNaN(this.detailObject[`Season`])) {
               this.dataService.alert(`Please enter a number for the season`);
               return;
          }

          this.dataService.updateWatchList(this.detailObject).subscribe((response) => {
               if (response !== null && response.length > 0 && response[0] === "ERROR") {
                    alert(response[1]);
                    return;
               }

               this.detailObject[`Disabled`]=true;

               this.isEditing = false;
               
               this.wasModified = true;

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}
