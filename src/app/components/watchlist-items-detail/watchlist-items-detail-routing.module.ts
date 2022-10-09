import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListItemsDetailComponent } from './watchlist-items-detail-page';
const routes: Routes = [
  {
     path: '',
     component: WatchListItemsDetailComponent,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListItemsDetailPageRoutingModule {}
