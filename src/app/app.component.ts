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
     readonly recordLimitOptions = [ // Only applied to WatchList not WatchlistItems
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService, private location: Location, private router: Router) { 
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

     reloadData(event) {
          if (event != null && event.target.id == "IMDBURLMissing") // || (this.currentRoute == "WatchListItems" && this.dataService.searchTerm != ''))
               this.dataService.getWatchListItemsSubscription();
          else {
               this.dataService.getWatchListSubscription();

               this.dataService.getWatchListItemsSubscription();
          }
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
