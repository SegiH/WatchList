import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListDetailPage } from './watchlist-detail-page';
const routes: Routes = [
  {
     path: '',
     component: WatchListDetailPage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListDetailPageRoutingModule {}
