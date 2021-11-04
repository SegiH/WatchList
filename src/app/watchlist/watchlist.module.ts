import { IonicModule } from '@ionic/angular';
import { NgModule, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchListPage } from './watchlist.page';

import { WatchListPageRoutingModule } from './watchlist-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,          
          WatchListPageRoutingModule
     ],
     declarations: [WatchListPage]
})
export class WatchListPageModule {}
