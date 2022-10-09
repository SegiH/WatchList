import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMDBSearchComponent } from './imdb-search.page';

import { IMDBSearchPageRoutingModule } from './imdb-search-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          IMDBSearchPageRoutingModule
     ],
     declarations: [IMDBSearchComponent]
})
export class IMDBSearchPageModule {}
