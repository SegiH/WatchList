import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListQueueDetailPage } from './watchlist-queue-detail-page';
const routes: Routes = [
  {
     path: '',
     component: WatchListQueueDetailPage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListQueueDetailPageRoutingModule {}