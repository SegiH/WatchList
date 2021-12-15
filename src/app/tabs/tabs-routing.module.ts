import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService as AuthGuard } from '../core/auth-guard-service';
import { DataService } from '../core/data.service';

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
               path: 'watchlist-queue',
               loadChildren: () => import('../watchlist-queue/watchlistqueue.module').then(m => m.WatchListQueuePageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'imdb-search', // The route settings are always here but this route won't get activated if IMDB API key is not provided because the IMDB Search tab gets hidden when API key is not present
               loadChildren: () => import('../imdb-search/imdb-search.module').then(m => m.IMDBSearchPageModule),
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