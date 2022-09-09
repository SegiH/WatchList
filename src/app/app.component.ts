import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './core/data.service';
import { Location } from "@angular/common";


@Component({
     selector: 'app-root',
     templateUrl: 'app.component.html',
     styleUrls: ['app.component.scss'],
})
export class AppComponent {
     currentRoute: string = "";
     isEditingOptions: boolean = false;
     readonly recordLimitOptions = [ // Only applied to WatchList not WatchlistItems
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService, private location: Location, private router: Router) { 
          this.router.navigateByUrl("/");
          
          // save current route so I can show filters in the menu that depend on the active tab
          router.events.subscribe(val => {
               if (location.path() != "") {
                    switch (location.path()) {
                         case "/tabs/watchlist":
                              this.currentRoute="WatchList"
                              break;
                         case "/tabs/watchlist-items":
                              this.currentRoute="WatchListItems"
                              break;
                    }
               } 
          });
     }

     editOptions() {
          this.isEditingOptions = true;
     }

     saveOptions() {
          if (this.dataService.backendURL == null || this.dataService.backendURL == "") {
               alert("Please set the Backend URL");
               return;
          }

          if (this.dataService.auth_key == null || this.dataService.auth_key == "") {
               alert("Please set the Auth Key");
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

     reloadData(event: any) {
          if (event != null && event.target.id == "IMDBURLMissing")
               this.dataService.getWatchListItemsSubscription(true);
          else {
               this.dataService.getWatchListSubscription();

               this.dataService.getWatchListItemsSubscription(true);
          }
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
