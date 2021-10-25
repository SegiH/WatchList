import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'watchlist',
        loadChildren: () => import('../watchlist/watchlist.module').then(m => m.WatchListPageModule)
      },
      {
        path: 'watchlist-items',
        loadChildren: () => import('../watchlist-items/watchlist-items.module').then(m => m.WatchListItemsPageModule)
      }/*,
      {
        path: '',
        redirectTo: '/tabs/watchlist',
        pathMatch: 'full'
      },
      {
        path: 'tabs/watchlist',
        loadChildren: () => import('../watchlist/watchlist.module').then(m => m.WatchListPageModule)
      },*/
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/watchlist',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
