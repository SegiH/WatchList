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

     detailObject: IWatchList;
     detailObjectName: string;
     isAdding: boolean;
     isEditing: boolean;
     lastIndex = null;
     lastRating = null;
     readonly math = Math;

     constructor(private dataService: DataService) { }

     ngDoCheck(): void {
          this.detailObject=this.dataService.getDetailObject();

          this.detailObjectName=this.dataService.getDetailObjectName();

          const addWatchListItemID=this.dataService.getDetailWatchListItemID();

          if (addWatchListItemID !== null) {
               this.addItemID=addWatchListItemID;
          }

          if (this.dataService.getDetailID() == null) {
               this.isAdding=true;

               // Default start date to current date
               /*const dateStr = new Date().setSeconds(0,0);
               const dt = new Date(dateStr).toISOString().substring(0,10);

               if (this.addItemStartDate === '') {
                    this.addItemStartDate=dt;
               }*/
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

     deleteWatchList(currWatchList: object) {
          this.dataService.confirmDialog(currWatchList,'Are you sure that you want to delete this item ?',this.deleteWatchListCallback.bind(this));
     }

     deleteWatchListCallback() {
          this.dataService.deleteWatchList(this.detailObject['WatchListID']).subscribe((response) => {
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
          return (
               this.detailObject?.Rating > index + 0.5 ? "heart" : this.detailObject?.Rating === index + 0.5 ? "heart-half" : "heart-outline"
          )
     }

     numSequence(n: number): Array<number> {
          return Array(n);
     }

     ratingClickHandler(index: number) {
          if (!this.isAdding && !this.isEditing)
               return true;

          if (this.detailObject.Rating === null)
               this.detailObject.Rating=0;

          /*if (String(this.detailObject.Rating) === String(index + ".0"))
               this.detailObject.Rating = index + 0.5;
          else if (String(this.detailObject.Rating) === String(index + ".5"))
               this.detailObject.Rating = index;
          else
               this.detailObject.Rating = parseFloat(index.toFixed(1));*/

          switch(index) {
               case 0:
                    if (this.detailObject.Rating === 0.0)
                         this.detailObject.Rating = 0.5;
                    else if (this.detailObject.Rating === 0.5)
                         this.detailObject.Rating = 1.0;
                    else
                         this.detailObject.Rating = 0.0;

                    break;
               case 1:
                    if (this.detailObject.Rating === 1.0)
                         this.detailObject.Rating = 1.5;
                    else if (this.detailObject.Rating === 1.5)
                         this.detailObject.Rating = 2.0;
                    else
                         this.detailObject.Rating = 1.0;

                    break;
               case 2:
                    if (this.detailObject.Rating === 2.0)
                         this.detailObject.Rating = 2.5;
                    else if (this.detailObject.Rating === 2.5)
                         this.detailObject.Rating = 3.0;
                    else
                         this.detailObject.Rating = 2.0;

                    break;
               case 3:
                    if (this.detailObject.Rating === 3.0)
                         this.detailObject.Rating = 3.5;
                    else if (this.detailObject.Rating === 3.5)
                         this.detailObject.Rating = 4.0;
                    else
                         this.detailObject.Rating = 3.0;

                    break;
               case 4:
                    if (this.detailObject.Rating === 4.0)
                         this.detailObject.Rating = 4.5;
                    else if (this.detailObject.Rating === 4.5)
                         this.detailObject.Rating = 5.0;
                    else
                         this.detailObject.Rating = 4.0;

                    break;
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

               this.isAdding=false;

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

               this.dataService.getWatchListSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}
