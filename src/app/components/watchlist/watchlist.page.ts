import { Component, DoCheck } from '@angular/core';
import IWatchList from 'src/app/interfaces/watchlist.interface';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist',
     templateUrl: 'watchlist.page.html',
     styleUrls: ['watchlist.page.scss']
})
export class WatchListComponent implements DoCheck {
     currentPage = 1;
     filteredWatchList: IWatchList[];
     readonly math = Math;

     constructor(public dataService: DataService) { }

     ngDoCheck(): void {
          if (typeof this.dataService.watchList !== 'undefined' && this.dataService.watchList.length > 0) {
               this.filteredWatchList=this.dataService.watchList.filter((wl: IWatchList) => {
                    return (
                         (this.dataService.searchTerm === ""
                         || (this.dataService.searchTerm !== ""
                            && (
                               this.dataService.getWatchListItemName(wl.WatchListItemID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                               || (wl.WatchListSourceID !== null && this.dataService.getSourceName(wl.WatchListSourceID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                            )
                         || (wl.Notes  !== null && wl.Notes.toLowerCase().includes(this.dataService.searchTerm.toLowerCase())))
                         ))
                         &&
                         ((this.dataService.incompleteFilter === true && wl.EndDate === null)
                         || (this.dataService.incompleteFilter !== true && wl.EndDate !== null))
                    )
               });
          }
     }

     addWatchList() {
          this.dataService.openDetailOverlay('watchlist',null);
     }

     isShown(pageIndex: number) {
          if (typeof this.filteredWatchList !== 'undefined' && this.filteredWatchList.length < this.dataService.itemsPerPage)
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
