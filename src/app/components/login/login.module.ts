import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { LoginPageRoutingModule } from './login-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          LoginPageRoutingModule,
     ],
     declarations: [LoginComponent]
})
export class LoginPageModule {}
