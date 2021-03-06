import { IonicModule } from '@ionic/angular';
import { NgModule, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchListQueuePage } from './watchlistqueue.page';

import { WatchListQueuePageRoutingModule } from './watchlistqueue-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,          
          WatchListQueuePageRoutingModule
     ],
     declarations: [WatchListQueuePage]
})
export class WatchListQueuePageModule {}