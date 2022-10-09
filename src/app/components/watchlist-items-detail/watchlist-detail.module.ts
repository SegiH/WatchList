import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { DetailOverlay } from '../detail-overlay/detail-overlay';
import { WatchListItemsDetailComponent } from '../watchlist-items-detail/watchlist-items-detail-page';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          OverlayModule
     ],
     declarations: [DetailOverlay, WatchListItemsDetailComponent]
})
export class WatchListItemsDetailPageModule {}
