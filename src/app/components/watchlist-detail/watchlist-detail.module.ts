import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OverlayModule } from "@angular/cdk/overlay";
import { DetailOverlay } from '../detail-overlay/detail-overlay';
import { WatchListDetailPage } from './watchlist-detail-page';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          OverlayModule
     ],
     declarations: [DetailOverlay, WatchListDetailPage]
})
export class WatchListDetailPageModule {}
