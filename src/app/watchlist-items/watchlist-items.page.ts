import { Component } from '@angular/core';
import { DataService } from '../core/data.service';
import { AlertController } from '@ionic/angular';

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

     readonly columnSizes = {
          'ID': 2,
          'Name': 1,
          'Type': 2,
          'IMDBURL': 2,
          'Notes' : 2,
          'Action' : 2,
     }

     constructor(public alertController: AlertController, public dataService: DataService) {}

     addWatchListItem() {
          this.dataService.isAdding=true;
     }

     cancelAddWatchListItem() {          
          this.addItemName = '';
          this.addItemIMDBURL = '';
          this.addItemType = '';

          this.dataService.isAdding=false;
     }

     cancelEditWatchListItem(currWatchListItem: []) {
          currWatchListItem["WatchListItemID"]=currWatchListItem[`Previous`].WatchListItemID;
          currWatchListItem["WatchListTypeID"]=currWatchListItem[`Previous`].WatchListTypeID;
          currWatchListItem["IMDB_URL"]=currWatchListItem[`Previous`].IMDB_URL;

          currWatchListItem[`Disabled`]=true;

          this.dataService.isEditing = false;
     }

     async confirmDialog(currWatchListItem: object, message: string, callback: any) {
          const alert = await this.alertController.create({
               header: 'Alert',
               message: message,
               buttons: ['OK','Cancel']
          });
    
          await alert.present();
    
          const { role } = await alert.onDidDismiss();

          if (role != "cancel" ) { // OK
               callback(currWatchListItem);
          }
     }     

     deleteWatchListItem(currWatchListItem: object) {
          this.confirmDialog(currWatchListItem,"Are you sure that you want to delete this item ?",this.deleteWatchListItemCallback)
     }

     deleteWatchListItemCallback(currWatchListItem) {
          this.dataService.deleteWatchListItem(currWatchListItem['WatchListItemID']).subscribe((response) => {
               this.dataService.getWatchListItemsSubscription();
          },
          error => {
               console.log(`An error occurred deleting WatchList Item with ID ${currWatchListItem['WatchListID']}`)
          });
     }

     /*doRefresh(event) {
          setTimeout(() => {
               this.dataService.getWatchListItems().subscribe((response) => {
                    if (response != null)
                         for (let i=0;i<response.length;i++)
                              response[i].Disabled = true;

                    this.dataService.setWatchlistItems(response);

                    event.target.complete();
               },
               error => {       
               });
          }, 2000);
     }*/

     editWatchListItem(currWatchListItem: []) {
          currWatchListItem[`Previous`]=[];

          Object.assign(currWatchListItem[`Previous`], currWatchListItem);
          
          currWatchListItem[`Disabled`]=false;

          this.dataService.isEditing = true;
     }

     saveNewWatchListItem() {
          if (this.addItemName === ``) {
               alert(`Please enter the name`);
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
               this.dataService.getWatchListSubscription();

               this.addItemName = '';
               this.addItemType = '';
               this.addItemIMDBURL = '';
               this.addItemNotes = '';

               this.dataService.isAdding = false;

               this.dataService.getWatchListItemsSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });
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

               this.dataService.isEditing = false;

               this.dataService.getWatchListItemsSubscription();
          },
          error => {
               this.dataService.handleError(error);
          });          
     }

     searchFilter() {
          this.dataService.getWatchListSubscription();
     }
}
