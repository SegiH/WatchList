import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist',
     templateUrl: 'watchlist-stats.page.html',
     styleUrls: ['watchlist-stats.page.scss']
})
export class WatchListStatsComponent implements OnInit{
     watchListMovieStats: [];
     watchListTVStats: [];

     constructor(public dataService: DataService) {}

     ngOnInit() {
         this.getWatchListMovieStatsSubscription();

         this.getWatchListTVStatsSubscription();
     }

     getWatchListMovieStatsSubscription() {
          this.dataService.getWatchListMovieStats().subscribe((response) => {
               this.watchListMovieStats=response;
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     getWatchListTVStatsSubscription() {
          this.dataService.getWatchListTVStats().subscribe((response) => {
               this.watchListTVStats=response;
          },
          error => {
               this.dataService.handleError(error);
          });
     }
}
