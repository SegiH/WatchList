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
     readonly recordLimitOptions = [ // Only applied to WatchList not WatchlistItems
          10,
          50,
          100,
          500
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

     reloadData(event: any) {
          if (event != null && event.target.id === 'IMDBURLMissing') {
               this.dataService.getWatchListItemsSubscription(true);
          } else {
               this.dataService.getWatchListSubscription();

               this.dataService.getWatchListItemsSubscription(true);
          }
     }

     saveOptions() {
          if (this.dataService.userData.BackendURL === null || this.dataService.userData.BackendURL === '') {
               this.dataService.alert('Please set the Backend URL');
               return;
          }

          this.dataService.getIMDBSearchEnabledSubscription();

          this.dataService.getWatchListItemsSubscription(false);

          this.dataService.getWatchListSubscription();

          this.dataService.getWatchListQueueSubscription();

          this.dataService.getWatchListTypesSubscription();

          this.dataService.getWatchListSourcesSubscription();

          this.isEditingOptions=false;

          this.reloadData(null);
     }

     signOut() {
          this.dataService.confirmDialog(null,'Are you sure that you want to sign out ?',this.signOutConfirmClickHandler.bind(this));
     }

     signOutConfirmClickHandler() {
          this.dataService.setBackendURL();

          this.dataService.runRest('/SignOut','GET',null).subscribe((response) => {
               this.menu.close();
               this.router.navigateByUrl('/tabs/login');
          },
          error => {
               this.router.navigateByUrl('/tabs/login');
          })
          setTimeout(() => {
               this.router.navigateByUrl('/tabs/login');
          }, 10000)
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
