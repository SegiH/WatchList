import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchListStatsPage } from './watchlist-stats.page';

import { WatchListStatsPageRoutingModule } from './watchlist-stats-routing.module';

@NgModule({
     imports: [
          IonicModule,
          CommonModule,
          FormsModule,
          WatchListStatsPageRoutingModule
     ],
     declarations: [WatchListStatsPage]
})
export class WatchListStatsPageModule {
    constructor() {}

    handleError(response: Response, error: Error) { }
}
