import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
     selector: 'app-watchlistqueue',
     templateUrl: 'watchlistqueue.page.html',
     styleUrls: ['watchlistqueue.page.scss']
})
export class WatchListQueuePage {
     constructor(public dataService: DataService) { }
}