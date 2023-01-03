import { Component, isDevMode } from '@angular/core';
import { DataService } from '../../core/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
     backendURL = '';
     backendURLVisible = false;
     forceBackendURLVisible = false;
     loginClickCount = 0;
     password = '';
     username='';

     constructor(public dataService: DataService) {
          if (dataService.isMobile || (window.location.origin.startsWith("http://") && isDevMode())) {
               this.backendURLVisible = true; 
               this.forceBackendURLVisible = true;
          }
     }

     loginClickCountHandler() {
          // Ignore this logic if forceBackendURLVisible = true. This is needed because I don't want to allow the user to hide the backendURL on iOS or Android
          if (this.forceBackendURLVisible)
               return;

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

          if (this.backendURLVisible) { 
               if (this.backendURL === null || this.backendURL === '') {
                    this.dataService.alert('Please enter the backendURL');
                    return;
               }
          } else {
               this.backendURL=window.location.origin;
          }

          this.dataService.loginSubscription(this.username,this.password,this.backendURL);
     }
}
