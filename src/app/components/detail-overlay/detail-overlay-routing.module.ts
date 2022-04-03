import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailOverlay } from './detail-overlay';

const routes: Routes = [
  {
     path: '',
     component: DetailOverlay,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class DetailOverlayPageRoutingModule {}