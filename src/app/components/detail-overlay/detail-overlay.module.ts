import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DetailOverlayPageRoutingModule } from './detail-overlay-routing.module';
import { CommonModule } from '@angular/common';
@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,          
          DetailOverlayPageRoutingModule
     ]
})
export class DetailOverlayPageModule {}