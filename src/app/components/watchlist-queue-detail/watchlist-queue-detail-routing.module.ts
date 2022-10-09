import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListQueueDetailComponent } from './watchlist-queue-detail-page';
const routes: Routes = [
  {
     path: '',
     component: WatchListQueueDetailComponent,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListQueueDetailPageRoutingModule {}
