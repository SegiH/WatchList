import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListStatsPage } from './watchlist-stats.page';

const routes: Routes = [
  {
     path: '',
     component: WatchListStatsPage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListStatsPageRoutingModule {}