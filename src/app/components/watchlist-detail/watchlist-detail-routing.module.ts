import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListDetailComponent } from './watchlist-detail-page';
const routes: Routes = [
  {
     path: '',
     component: WatchListDetailComponent,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListDetailPageRoutingModule {}
