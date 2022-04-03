import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { WatchListDetailPageRoutingModule } from '../components/watchlist-detail/watchlist-detail-routing.module';
import { WatchListItemsDetailPageRoutingModule } from '../components/watchlist-items-detail/watchlist-items-detail-routing.module';
import { WatchListQueueDetailPageRoutingModule } from '../components/watchlist-queue-detail/watchlist-queue-detail-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          TabsPageRoutingModule,
          WatchListDetailPageRoutingModule,
          WatchListItemsDetailPageRoutingModule,
          WatchListQueueDetailPageRoutingModule
      ],
      declarations: [TabsPage]
})
export class TabsPageModule {}