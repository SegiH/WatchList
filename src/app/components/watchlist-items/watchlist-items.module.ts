import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchListItemsPage } from './watchlist-items.page';
import { WatchListItemsPageRoutingModule } from './watchlist-items-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          WatchListItemsPageRoutingModule
     ],
     declarations: [WatchListItemsPage]
})
export class WatchListItemsPageModule {}