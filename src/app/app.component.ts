import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './core/data.service';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular';

@Component({
     selector: 'app-root',
     templateUrl: 'app.component.html',
     styleUrls: ['app.component.scss'],
})
export class AppComponent {
     currentRoute = '';
     isEditingOptions = false;
     
     readonly itemsPerPage = [
          10,
          20,
          50,
          100,
          500,
          1000
     ]

     readonly recordLimitOptions = [
          10,
          50,
          100,
          500,
          1000
     ];

     constructor(public dataService: DataService, location: Location, private menu: MenuController, private router: Router) {
          // save current route so I can show filters in the menu that depend on the active tab
          router.events.subscribe(() => {
               if (location.path() !== '') {
                    switch (location.path()) {
                         case '/tabs/watchlist':
                              this.currentRoute='WatchList';
                              break;
                         case '/tabs/watchlist-items':
                              this.currentRoute='WatchListItems';
                              break;
                    }
               }
          });
     }

     editOptions() {
          this.isEditingOptions = true;
     }

     optionChangeHandler(event: any) {
          this.dataService.saveIncompleteFilter();
          this.dataService.saveRecordLimitFilter();
          this.dataService.saveSourceFilter();
          this.dataService.saveTypeFilter();
          this.dataService.saveItemsPerPageFilter();
          this.dataService.saveIMDBURLMissingFilter();
     }

     signOut() {
          this.dataService.confirmDialog(null,'Are you sure that you want to sign out ?',this.signOutConfirmClickHandler.bind(this));
     }

     signOutConfirmClickHandler() {
          //this.dataService.setBackendURL();

          this.dataService.isLoggedIn = false;
          
          this.dataService.runRest('/SignOut','GET',null).subscribe((response) => {
               this.menu.close();
               this.router.navigateByUrl('/tabs/login');
          },
          error => {
               this.router.navigateByUrl('/tabs/login');
          });

          setTimeout(() => {
               this.router.navigateByUrl('/tabs/login');
          }, 10000)
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
