import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IMDBSearchPage } from './imdb-search.page';

const routes: Routes = [
  {
     path: '',
     component: IMDBSearchPage,
  }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class IMDBSearchPageRoutingModule {}
