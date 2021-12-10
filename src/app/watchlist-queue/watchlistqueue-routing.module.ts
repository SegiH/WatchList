import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListQueuePage } from './watchlistqueue.page';

const routes: Routes = [
  {
     path: '',
     component: WatchListQueuePage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListQueuePageRoutingModule {}
