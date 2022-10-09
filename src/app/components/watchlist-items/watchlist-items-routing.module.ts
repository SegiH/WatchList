import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchListItemsComponent } from './watchlist-items.page';

const routes: Routes = [
  {
     path: '',
     component: WatchListItemsComponent,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class WatchListItemsPageRoutingModule {}
