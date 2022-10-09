import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist-items',
     templateUrl: 'watchlist-items.page.html',
     styleUrls: ['watchlist-items.page.scss']
})
export class WatchListItemsComponent {
     constructor(public dataService: DataService) { }

     addWatchListItem() {
          this.dataService.openDetailOverlay('watchlist-items',null);
     }
}
