import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist-items-detail',
     templateUrl: 'watchlist-items-detail.page.html',
     styleUrls: ['watchlist-items-detail.page.scss']
})
export class WatchListItemsDetailPage {
     addItemName = '';
     addItemType = '';
     addItemIMDBURL = '';
     addItemNotes= '';
     
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

     cancelWatchListItem() {
          if (this.isEditing) {
               this.detailObject["WatchListItemName"]=this.detailObject[`Previous`].WatchListItemName;
               this.detailObject["WatchListTypeID"]=this.detailObject[`Previous`].WatchListTypeID;
               this.detailObject["IMDB_URL"]=this.detailObject[`Previous`].IMDB_URL;
               this.detailObject["Notes"]=this.detailObject[`Previous`].Notes;

               this.isEditing = false;
          }

          if (this.isAdding) {
               this.isEditing = false;

               this.dataService.closeOverlay();
          }
     }

     deleteWatchListItem(currWatchListItem: object) {
          this.dataService.confirmDialog(currWatchListItem,"Are you sure that you want to delete this item ?",this.deleteWatchListItemCallback.bind(this))
     }

     deleteWatchListItemCallback(currWatchListItem) {
          this.dataService.deleteWatchListItem(currWatchListItem['WatchListItemID']).subscribe((response) => {
               this.dataService.getWatchListItemsSubscription(true);
          },
          error => {
               console.log(`An error occurred deleting WatchList Item with ID ${currWatchListItem['WatchListID']}`)
          });
     }

     editWatchListItem() {
          this.isEditing=true;

          this.detailObject[`Previous`]=[];

          Object.assign(this.detailObject[`Previous`], this.detailObject);
     }

     saveWatchListItem() {
          if (this.isAdding)
               this.saveNewWatchListItem();

          if (this.isEditing)
               this.saveExistingWatchListItem();
     }

     saveNewWatchListItem() {
          if (this.addItemName === ``) {
               alert(`Please select the name`);
               return;
          }

          if (this.addItemType === ``) {
               alert(`Please enter the start date`);
               return;
          }

          const currWatchList: any=[];
          currWatchList.WatchListItemID=this.addItemName;
          currWatchList.WatchListTypeID=this.addItemType;
          currWatchList.IMDB_URL=this.addItemIMDBURL;
          currWatchList.Notes=this.addItemNotes;

          this.dataService.addWatchList(currWatchList).subscribe((response) => {
               this.addItemName = '';
               this.addItemType = '';
               this.addItemIMDBURL = '';
               this.addItemNotes= '';

               this.isAdding=false;

               this.dataService.getWatchListItemsSubscription(false);

               this.dataService.closeOverlay();

          },
          error => {
               this.dataService.handleError(error);
          });
     }

     saveExistingWatchListItem() {
          if (this.detailObject[`WatchListItemName`] === ``) {
               alert(`Please select the name`);
               return;
          }

          if (this.detailObject[`WatchListTypeID`] === ``) {
               alert(`Please select the type`);
               return;
          }

          this.dataService.updateWatchListItem(this.detailObject).subscribe((response) => {
               this.isEditing = false;

               this.dataService.getWatchListItemsSubscription(true);
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}