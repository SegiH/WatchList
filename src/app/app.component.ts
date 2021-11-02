import { Component } from '@angular/core';
import { DataService } from './core/data.service';
import { Router, Event, NavigationStart } from '@angular/router';

@Component({
     selector: 'app-root',
     templateUrl: 'app.component.html',
     styleUrls: ['app.component.scss'],
})
export class AppComponent {
     backendURL = '';
     readonly recordLimitOptions = [
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService,private router: Router) { }

     recordLimitChanged() {
          switch (this.router.url) {
               case "/tabs/watchlist":
                    this.dataService.getWatchListSubscription(null,null)
                    break;
               case "/tabs/watchlist-items":
                    this.dataService.getWatchListItemsSubscription(null,null);
                    break;
          }
     }

     searchFilter() {
          switch (this.router.url) {
               case "/tabs/watchlist":
                    this.dataService.getWatchListSubscription(null,null)
                    break;
               case "/tabs/watchlist-items":
                    this.dataService.getWatchListItemsSubscription(null,null);
                    break;
          }
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
