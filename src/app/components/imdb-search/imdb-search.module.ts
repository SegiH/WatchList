import { IonicModule } from '@ionic/angular';
import { NgModule, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMDBSearchPage } from './imdb-search.page';

import { IMDBSearchPageRoutingModule } from './imdb-search-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,          
          IMDBSearchPageRoutingModule
     ],
     declarations: [IMDBSearchPage]
})
export class IMDBSearchPageModule {}
