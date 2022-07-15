import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-imdbsearch',
     templateUrl: 'imdb-search.page.html',
     styleUrls: ['imdb-search.page.scss']
})
export class IMDBSearchPage {
     searchTerm = '';
     searchResults: any;

     constructor(public dataService: DataService) { }

     addSearchResult(currSearchResult: any, index: number) {
          const currWatchListItem: any=[];
          currWatchListItem.Name=currSearchResult['Title'];
          
          if (currSearchResult['Type'] == "movie")
               currWatchListItem.Type=1
          else if (currSearchResult['Type'] == "series")
               currWatchListItem.Type=2
          else
               currWatchListItem.Type=3 // Other
                         
          currWatchListItem.IMDB_URL=`https://www.imdb.com/title/${currSearchResult['imdbID']}/`
          
          this.dataService.addWatchListItem(currWatchListItem).subscribe((response) => {
               this.searchResults.splice(index,1); // Remove it from the the search results since its been added

               this.dataService.getWatchListItemsSubscription(true);

               this.dataService.autoAddWatchListRecord(currWatchListItem.IMDB_URL); // When adding item through IMDB search, it may exist already. In this case, it won't have a new ID
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     handleKeyUp(e) { // Submit search when enter is pressed in search field
          if (e.keyCode === 13) // Submit when enter is pressed
               this.searchIMDB();
     }     

     searchIMDB() {
          if (this.searchTerm != '' && this.searchTerm != null) {
               this.dataService.searchIMDB(this.searchTerm).subscribe((response) => {
                    if (response.Response == "False") {
                         alert(`${response.Error}`)
                    } else {
                         this.searchResults=Object.entries(response)[0][1]; // This contains the actual search results
                    }
               },
               error => {
                    console.log(`An error occurred searching IMDB`)
               });
          } else
               alert("Please enter a search term");
     }
}