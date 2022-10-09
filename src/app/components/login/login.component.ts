import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
     backendURL = '';
     password = '';
     username='';

     constructor(public dataService: DataService) { }

     login() {
          if (this.username === null || this.username === '') {
               this.dataService.alert('Please enter the username');
               return;
          }

          if (this.password === null || this.password === '') {
               this.dataService.alert('Please enter the password');
               return;
          }

          if (this.backendURL === null || this.backendURL === '') {
               this.dataService.alert('Please enter the backendURL');
               return;
          }

          this.dataService.loginSubscription(this.username,this.password,this.backendURL);
     }
}
