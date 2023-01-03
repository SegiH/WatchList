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
          if (this.dataService.incompleteFilter === null) {
               this.dataService.incompleteFilter = true;
          }

          if (this.dataService.recordLimit=== null) {
               this.dataService.recordLimit=50;
          }
     
          if (typeof this.dataService.watchList !== 'undefined' && this.dataService.watchList.length > 0) {
               this.filteredWatchList=this.dataService.watchList.filter((wl: IWatchList, index: number) => {
                    return (
                         (this.dataService.searchTerm === ""
                         || (this.dataService.searchTerm !== ""
                            && (
                               this.dataService.getWatchListItemName(wl.WatchListItemID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                               || (wl.WatchListSourceID !== null && this.dataService.getSourceName(wl.WatchListSourceID).toLowerCase().includes(this.dataService.searchTerm.toLowerCase())
                            )
                         || (wl.Notes !== null && wl.Notes.toLowerCase().includes(this.dataService.searchTerm.toLowerCase())))
                         ))
                         &&
                         ((this.dataService.incompleteFilter === true && wl.EndDate === null)
                         || (this.dataService.incompleteFilter !== true && wl.EndDate !== null))
                    )
               });

               if (this.filteredWatchList.length > this.dataService.recordLimit)
                    this.filteredWatchList.length = this.dataService.recordLimit;

               for (let i=0;i<this.filteredWatchList.length;i++) {
                    this.filteredWatchList[i]["Tooltip"]="ID " + this.filteredWatchList[i].WatchListID + ": " + (this.filteredWatchList[i].EndDate == null ? 'Started watching ' : 'Watched ') + (this.filteredWatchList[i].Season !== null ? 'season ' + this.filteredWatchList[i].Season + ' ' : '' ) + 'on ' + this.dataService.getSourceName(this.filteredWatchList[i].WatchListSourceID) + ` ${new Date(this.filteredWatchList[i].StartDate).toLocaleDateString()}` + (this.filteredWatchList[i].EndDate != null && this.filteredWatchList[i].EndDate != this.filteredWatchList[i].StartDate ? `- ${new Date(this.filteredWatchList[i].EndDate).toLocaleDateString()}` : ``);
               }
          }
     }

     addWatchList() {
          this.dataService.openDetailOverlay('watchlist',null);
     }

     getRatingIcon(index: number, currWatchList: IWatchList) {
          return currWatchList?.Rating > index + 0.5 ? "heart" : currWatchList?.Rating === index + 0.5 ? "heart-half" : "heart-outline"
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

     ratingClickHandler(index: number, currWatchList: IWatchList) {
          if (String(currWatchList.Rating + ".0") === String(index + ".0")) {
               currWatchList.Rating = index + 0.5;
          } else if (String(currWatchList.Rating) === String(index + ".5")) {
               currWatchList.Rating = parseFloat((index+1).toFixed(1));
          } else {
               currWatchList.Rating = parseFloat(index.toFixed(1));
          }

          this.dataService.updateWatchList(currWatchList).subscribe((response) => {
               if (response !== null && response.length > 0 && response[0] === "ERROR") {
                    alert(response[1]);
                    return;
               }
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}
