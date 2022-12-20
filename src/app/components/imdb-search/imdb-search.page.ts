import { Component, ViewChild } from '@angular/core';
import IWatchListItem from 'src/app/interfaces/watchlistitem.interface';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-imdbsearch',
     templateUrl: 'imdb-search.page.html',
     styleUrls: ['imdb-search.page.scss']
})
export class IMDBSearchComponent {
     searchTerm = '';
     searchResults: any;

     @ViewChild('search') search;

     constructor(public dataService: DataService) {}

     ionViewDidEnter() {
          setTimeout(() => {
            this.search.setFocus();
       });
     }

     addSearchResult(currSearchResult: any, index: number) {
          const currWatchListItem: any=[];
          currWatchListItem.WatchListItemName=currSearchResult['Title'];

          if (currSearchResult['Type'] === 'movie') {
               currWatchListItem.WatchListTypeID=1;
          } else if (currSearchResult['Type'] === 'series') {
               currWatchListItem.WatchListTypeID=2;
          } else {
               currWatchListItem.WatchListTypeID=3; // Other
          }

          currWatchListItem.IMDB_URL=`https://www.imdb.com/title/${currSearchResult['imdbID']}/`;
          currWatchListItem.IMDB_Poster=currSearchResult['Poster'];

          this.dataService.addWatchListItem(currWatchListItem).subscribe((response) => {
               if (response == null) { // No response on success
                    this.searchResults.splice(index,1); // Remove it from the the search results since its been added

                    this.dataService.getWatchListItemsSubscription(true);

                    // When adding item through IMDB search, it may exist already. In this case, it won't have a new ID
                    this.dataService.autoAddWatchListRecord(currWatchListItem.IMDB_URL);
               } else {
                    this.dataService.alert('An error occurred adding the item');
               }
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     handleKeyUp(e) { // Submit search when enter is pressed in search field
          if (e.keyCode === 13) { // Submit when enter is pressed
               this.searchIMDB();
          }
     }

     searchIMDB() {
          if (this.searchTerm !== '' && this.searchTerm !== null) {
               this.dataService.searchIMDB(this.searchTerm).subscribe((response) => {
                    if (response.Response === 'False') {
                         this.dataService.alert(`${response.Error}`);
                    } else {
                         this.searchTerm='';
                         this.searchResults=Object.entries(response)[0][1]; // This contains the actual search results
                    }
               },
               error => {
                    console.log(`An error occurred searching IMDB`);
                    this.searchTerm='';
               });
          } else {
               this.dataService.alert('Please enter a search term');
          }
     }
}
