import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './core/data.service';
import { Location } from "@angular/common";

@Component({
     selector: 'app-root',
     templateUrl: 'app.component.html',
     styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
     currentRoute: string = "";
     readonly recordLimitOptions = [ // Only applied to WatchList not WatchlistItems
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService, private location: Location, private router: Router) { 
          //console.log(`URL is ${this.router.url}`)
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
                 //   console.log(`Path: ${location.path()}`)
                 //this.route = location.path();
               } 
             });
     }

     ngOnInit() {
          //alert(`URL: ${this.router.url}`)
     }

     reloadData(event) {
          if (event == null)
               return;

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
