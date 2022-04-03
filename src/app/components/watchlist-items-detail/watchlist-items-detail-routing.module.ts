import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListItemsDetailPage } from './watchlist-items-detail-page';
const routes: Routes = [
  {
     path: '',
     component: WatchListItemsDetailPage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListItemsDetailPageRoutingModule {}