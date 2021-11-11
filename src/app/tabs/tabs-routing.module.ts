import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService as AuthGuard } from '../core/auth-guard-service';

const routes: Routes = [
     {
     path: 'tabs',
     component: TabsPage,
     children: [
          {
               path: 'watchlist',
               loadChildren: () => import('../watchlist/watchlist.module').then(m => m.WatchListPageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'watchlist-items',
               loadChildren: () => import('../watchlist-items/watchlist-items.module').then(m => m.WatchListItemsPageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'watchlist-stats',
               loadChildren: () => import('../watchlist-stats/watchlist-stats.modules').then(m => m.WatchListStatsPageModule),
               canActivate: [AuthGuard]
          }
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