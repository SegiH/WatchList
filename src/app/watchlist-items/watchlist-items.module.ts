import { IonicModule } from '@ionic/angular';
//import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchListItemsPage } from './watchlist-items.page';

import { WatchListItemsPageRoutingModule } from './watchlist-items-routing.module';

@NgModule({
     imports: [
          IonicModule,
          CommonModule,
          FormsModule,
          WatchListItemsPageRoutingModule
     ],
     declarations: [WatchListItemsPage]
})
export class WatchListItemsPageModule {
    constructor() {}

    handleError(response: Response, error: Error) { }
}
