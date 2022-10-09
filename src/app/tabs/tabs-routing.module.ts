import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.page';
import { AuthGuardService as AuthGuard } from '../core/auth-guard-service';

const routes: Routes = [
     {
     path: 'tabs',
     component: TabsComponent,
     children: [
          {
               path: 'login',
               loadChildren: () => import('../components/login/login.module').then(m => m.LoginPageModule)
          },
          {
               path: 'watchlist',
               loadChildren: () => import('../components/watchlist/watchlist.module').then(m => m.WatchListPageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'watchlist-items',
               loadChildren: () => import('../components/watchlist-items/watchlist-items.module').then(m => m.WatchListItemsPageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'watchlist-queue',
               loadChildren: () => import('../components/watchlist-queue/watchlistqueue.module').then(m => m.WatchListQueuePageModule),
               canActivate: [AuthGuard]
          },
          { // This route is defined but won't get activated if IMDB API key is not provided. IMDB tab is hidden when API key isn't set
               path: 'imdb-search',
               loadChildren: () => import('../components/imdb-search/imdb-search.module').then(m => m.IMDBSearchPageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'watchlist-stats',
               loadChildren: () => import('../components/watchlist-stats/watchlist-stats.modules').then(m => m.WatchListStatsPageModule),
               canActivate: [AuthGuard]
          },
          {
               path: 'detail-overlay',
               loadChildren: () => import('../components/detail-overlay/detail-overlay.module').then(m => m.DetailOverlayPageModule),
               canActivate: [AuthGuard]
          }
     ]
     },
     {
          path: '',
          redirectTo: '/tabs/login',
          pathMatch: 'full'
     }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
