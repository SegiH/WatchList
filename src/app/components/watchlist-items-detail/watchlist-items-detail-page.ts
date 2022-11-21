import { Component, DoCheck } from '@angular/core';
import IWatchListItem from 'src/app/interfaces/watchlistitem.interface';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist-items-detail',
     templateUrl: 'watchlist-items-detail.page.html',
     styleUrls: ['watchlist-items-detail.page.scss']
})
export class WatchListItemsDetailComponent implements DoCheck {
     addItemName = '';
     addItemType = '';
     addItemIMDBURL = '';
     addItemNotes= '';
     detailObject: IWatchListItem;
     detailObjectName: string;
     isAdding: boolean;
     isEditing: boolean;

     constructor(private dataService: DataService) {
     }

     ngDoCheck() {
          this.detailObject=this.dataService.getDetailObject();

          this.detailObjectName=this.dataService.getDetailObjectName();

          if (this.dataService.getDetailID() == null) {
               this.isAdding=true;
          }
     }

     cancelWatchListItem() {
          if (this.isEditing) {
               this.detailObject.WatchListItemName=this.detailObject.Previous.WatchListItemName;
               this.detailObject.WatchListTypeID=this.detailObject.Previous.WatchListTypeID;
               this.detailObject.IMDB_URL=this.detailObject.Previous.IMDB_URL;
               this.detailObject.ItemNotes=this.detailObject.Previous.ItemNotes;

               this.isEditing = false;
          }

          if (this.isAdding) {
               this.isEditing = false;

               this.dataService.closeOverlay();
          }
     }

     deleteWatchListItem(currWatchListItem: object) {
          this.dataService.confirmDialog(currWatchListItem,'Are you sure that you want to delete this item ?',this.deleteWatchListItemCallback.bind(this));
     }

     deleteWatchListItemCallback(currWatchListItem) {
          this.dataService.deleteWatchListItem(currWatchListItem.WatchListItemID).subscribe((response) => {
               this.dataService.getWatchListItemsSubscription(true);
          },
          error => {
               console.log(`An error occurred deleting WatchList Item with ID ${currWatchListItem.WatchListID}`);
          });
     }

     editWatchListItem() {
          this.isEditing=true;

          this.detailObject.Previous=this.dataService.iWatchListItemEmpty();

          Object.assign(this.detailObject.Previous, this.detailObject);
     }

     saveWatchListItem() {
          if (this.isAdding) {
               this.saveNewWatchListItem();
          }

          if (this.isEditing) {
               this.saveExistingWatchListItem();
          }
     }

     saveNewWatchListItem() {
          if (this.addItemName === ``) {
               this.dataService.alert(`Please select the name`);
               return;
          }

          if (this.addItemType === ``) {
               this.dataService.alert(`Please enter the start date`);
               return;
          }

          const currWatchList: any=[];
          currWatchList.Name=this.addItemName;
          currWatchList.Type=this.addItemType;
          currWatchList.IMDB_URL=this.addItemIMDBURL;
          currWatchList.ItemNotes=this.addItemNotes;

          this.dataService.addWatchListItem(currWatchList).subscribe((response) => {
               this.dataService.getWatchListItemsSubscription(true);

               this.isAdding=false;

               // TODO: Fix later!
               // this.dataService.autoAddWatchListRecord();

               this.dataService.closeOverlay();

               this.addItemName = '';
               this.addItemType = '';
               this.addItemIMDBURL = '';
               this.addItemNotes= '';
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     saveExistingWatchListItem() {
          if (this.detailObject.WatchListItemName === ``) {
               this.dataService.alert(`Please select the name`);
               return;
          }

          if (this.detailObject.WatchListTypeID === null) {
               this.dataService.alert(`Please select the type`);
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
