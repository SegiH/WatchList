import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IMDBSearchComponent } from './imdb-search.page';

const routes: Routes = [
  {
     path: '',
     component: IMDBSearchComponent,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class IMDBSearchPageRoutingModule {}
