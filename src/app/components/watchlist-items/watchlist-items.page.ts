import { Component, DoCheck } from '@angular/core';
import IWatchListItem from 'src/app/interfaces/watchlistitem.interface';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist-items',
     templateUrl: 'watchlist-items.page.html',
     styleUrls: ['watchlist-items.page.scss']
})
export class WatchListItemsComponent implements DoCheck {
     currentPage = 1;
     filteredWatchListItems: IWatchListItem[]
     readonly math = Math;

     constructor(public dataService: DataService) { }

     ngDoCheck(): void {
          if (typeof this.dataService.watchListItems !== 'undefined' && this.dataService.watchListItems.length > 0) {
               this.filteredWatchListItems=this.dataService.watchListItems.filter((wli: IWatchListItem) => {
                    return (
                         (this.dataService.searchTerm === ""
                         || (this.dataService.searchTerm !== ""
                            && (
                                    this.dataService.getWatchListItemName(wli.WatchListItemID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                                    || (wli.WatchListTypeID !== null && this.dataService.getWatchListTypeName(wli.WatchListTypeID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                               )
                         || (wli.ItemNotes  !== null && wli.ItemNotes.toLowerCase().includes(this.dataService.searchTerm.toLowerCase())))
                         ))
                         && (
                              this.dataService.imdb_url_missing === true && wli.IMDB_URL === null
                              || this.dataService.imdb_url_missing === false
                         )
                    )
               });
          }
     }

     addWatchListItem() {
          this.dataService.openDetailOverlay('watchlist-items',null);
     }

     isShown(pageIndex: number) {
          if (this.filteredWatchListItems.length < this.dataService.itemsPerPage)
               return true;

          if (pageIndex >= ((this.currentPage-1)*this.dataService.itemsPerPage) && pageIndex < ((this.currentPage-1)*this.dataService.itemsPerPage) + this.dataService.itemsPerPage)
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
