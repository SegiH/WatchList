import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListItemsPage } from './watchlist-items.page';

const routes: Routes = [
  {
     path: '',
     component: WatchListItemsPage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListItemsPageRoutingModule {}
