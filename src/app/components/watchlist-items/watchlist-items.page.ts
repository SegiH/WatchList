import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist-items',
     templateUrl: 'watchlist-items.page.html',
     styleUrls: ['watchlist-items.page.scss']
})
export class WatchListItemsComponent {
     currentPage = 1;
     readonly itemsPerPage = 20;
     readonly math = Math;

     constructor(public dataService: DataService) { }

     addWatchListItem() {
          this.dataService.openDetailOverlay('watchlist-items',null);
     }

     isShown(pageIndex: number) {
          if (this.dataService.watchListItems.length < this.itemsPerPage)
               return true;

          if (pageIndex >= ((this.currentPage-1)*this.itemsPerPage) && pageIndex < ((this.currentPage-1)*this.itemsPerPage) + this.itemsPerPage)
               return true;
          
          return false;
     }

     numSequence(n: number): Array<number> {
          if (isNaN(n)) {
               alert(`${n} is not valid`);
               return;
          }

          return Array(n);
     }

     paginationClickHandler(relativePage: number, absolutePage: number) {
          if (relativePage === -1 || relativePage === 1)
               this.currentPage+=relativePage;
          else if (absolutePage)
               this.currentPage=absolutePage;
     }
}
