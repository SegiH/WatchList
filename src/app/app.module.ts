import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { DetailOverlay } from './components/detail-overlay/detail-overlay';
import { WatchListDetailPage } from './components/watchlist-detail/watchlist-detail-page';
import { WatchListItemsDetailPage } from './components/watchlist-items-detail/watchlist-items-detail-page';
import { WatchListQueueDetailPage } from './components/watchlist-queue-detail/watchlist-queue-detail-page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, WatchListDetailPage, WatchListItemsDetailPage, WatchListQueueDetailPage, DetailOverlay],
    imports: [BrowserModule, FormsModule, HttpClientModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, OverlayModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent],
})
export class AppModule {}
