import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist',
     templateUrl: 'watchlist.page.html',
     styleUrls: ['watchlist.page.scss']
})
export class WatchListPage {     
     constructor(public dataService: DataService) { }

     addWatchList() {
          this.dataService.openDetailOverlay("watchlist",null);
     }
}