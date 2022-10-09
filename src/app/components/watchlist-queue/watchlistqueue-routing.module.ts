import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListQueueComponent } from './watchlistqueue.page';

const routes: Routes = [
  {
     path: '',
     component: WatchListQueueComponent,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListQueuePageRoutingModule {}
