import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
     backendURL = '';
     backendURLVisible = false;
     loginClickCount = 0;
     password = '';
     username='';

     constructor(public dataService: DataService) { }

     loginClickCountHandler() {
          this.loginClickCount++;

          if (this.loginClickCount === 3) {
               this.backendURLVisible=!this.backendURLVisible;
               this.loginClickCount=0;
          }
     }

     login() {
          if (this.username === null || this.username === '') {
               this.dataService.alert('Please enter the username');
               return;
          }

          if (this.password === null || this.password === '') {
               this.dataService.alert('Please enter the password');
               return;
          }

          if (this.backendURLVisible && (this.backendURL === null || this.backendURL === '')) {
               this.dataService.alert('Please enter the backendURL');
               return;
          }

          this.dataService.loginSubscription(this.username,this.password,this.backendURL);
     }
}
