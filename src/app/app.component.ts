import { Component } from '@angular/core';
import { DataService } from './core/data.service';
//import { Router, Event, NavigationStart } from '@angular/router';

@Component({
     selector: 'app-root',
     templateUrl: 'app.component.html',
     styleUrls: ['app.component.scss'],
})
export class AppComponent {
     readonly recordLimitOptions = [
          10,
          50,
          100,
          500
     ]

     constructor(public dataService: DataService) { }

     reloadData() {
          this.dataService.getWatchListSubscription(null,null); // Only WL is affected by the filters
     }

     // Used to prevent the entire DOM tree from being re-rendered every time that there is a change
     trackByFn(index, item) {
          return index; // or item.id
     }
}
