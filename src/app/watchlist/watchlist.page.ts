import { Component } from '@angular/core';
import { DataService } from '../core/data.service';
import { AlertController } from '@ionic/angular';

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
     
     constructor(public alertController: AlertController, public dataService: DataService) { }

     addWatchList() {
          this.dataService.isAdding=true;
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

     async confirmDialog(currWatchList: object, message: string, callback: any) {
          const alert = await this.alertController.create({
               header: 'Alert',
               message: message,
               buttons: ['OK','Cancel']
          });
    
          await alert.present();
    
          const { role } = await alert.onDidDismiss();

          if (role != "cancel" ) { // OK
               callback(currWatchList);
          }
     }

     deleteWatchList(currWatchList: object) {
          this.confirmDialog(currWatchList,"Are you sure that you want to delete this item ?",this.deleteWatchListCallback)
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
