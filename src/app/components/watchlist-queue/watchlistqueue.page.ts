import { Component, DoCheck } from '@angular/core';
import IWatchListQueueItem from 'src/app/interfaces/watchlistqueueitem.interface';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlistqueue',
     templateUrl: 'watchlistqueue.page.html',
     styleUrls: ['watchlistqueue.page.scss']
})
export class WatchListQueueComponent  implements DoCheck {
     currentPage = 1;
     filteredWatchListQueueItems: IWatchListQueueItem[]

     constructor(public dataService: DataService) { }

     ngDoCheck(): void {
          if (typeof this.dataService.watchListQueue !== 'undefined' && this.dataService.watchListQueue.length > 0) {
               this.filteredWatchListQueueItems=this.dataService.watchListQueue.filter((wlq: IWatchListQueueItem) => {
                    return (
                         (this.dataService.searchTerm === ""
                         || (this.dataService.searchTerm !== ""
                            && (
                                    wlq.WatchListItemName.toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                                    || (wlq.WatchListTypeID !== null && this.dataService.getWatchListTypeName(wlq.WatchListTypeID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                               )
                         || (wlq.Notes  !== null && wlq.Notes.toLowerCase().includes(this.dataService.searchTerm.toLowerCase())))
                         ))
                    )
               });
          }
     }

     isShown(pageIndex: number) {
          if (this.filteredWatchListQueueItems.length < this.dataService.itemsPerPage)
               return true;

          if (pageIndex >= ((this.currentPage-1)*this.dataService.itemsPerPage) && pageIndex < ((this.currentPage-1)*this.dataService.itemsPerPage) + this.dataService.itemsPerPage)
               return true;
          
          return false;
     }
}
