import { Component } from '@angular/core';
import { DataService } from './core/data.service';
//import { Router, Event, NavigationStart } from '@angular/router';

@Component({
     selector: 'app-root',
     templateUrl: 'app.component.html',
     styleUrls: ['app.component.scss'],
})
export class AppComponent {
     readonly recordLimitOptions = [ // Only applied to WatchList not WatchlistItems
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService) { }

     reloadData(event) {
          if (event.target.id == "IMDBURLMissing")
               this.dataService.getWatchListItemsSubscription(null,null); // IMDB URL Missing filter affects WL Items
          else 
               this.dataService.getWatchListSubscription(null,null); // All other filters affect WL
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
