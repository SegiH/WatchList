import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlist',
     templateUrl: 'watchlist-stats.page.html',
     styleUrls: ['watchlist-stats.page.scss']
})
export class WatchListStatsComponent implements OnInit{
     watchListMovieStats: [];
     watchListSourceStats: [];
     watchListTopRatedStats: [];
     watchListTVStats: [];

     constructor(public dataService: DataService) {}

     ngOnInit() {
         this.getWatchListMovieStatsSubscription();

         this.getWatchListTVStatsSubscription();

         this.getWatchListSourceStatsSubscription();

         this.getWatchListTopRatedStatsSubscription();
     }

     getWatchListMovieStatsSubscription() {
          this.dataService.getWatchListMovieStats().subscribe((response) => {
               this.watchListMovieStats=response;
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     getWatchListSourceStatsSubscription() {
          this.dataService.getWatchListSourceStats().subscribe((response) => {
               this.watchListSourceStats=response;
          },
          error => {
               this.dataService.handleError(error);
          });
     }

     getWatchListTopRatedStatsSubscription() {
          this.dataService.getWatchListTopRatedStats().subscribe((response) => {
               this.watchListTopRatedStats=response;
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
