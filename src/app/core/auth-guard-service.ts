import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
     providedIn: 'root'
})
export class AuthGuardService implements CanActivate {  
     constructor(public dataService: DataService, public router: Router) {}  
     
     canActivate(): boolean {
          if (this.dataService.detailObjectName !== null && this.dataService.detailObjectName.toLowerCase() != this.router.url.replace("/tabs/","").toLowerCase()) { // Prevents switching tabs while adding or editing an item. Prevents switching to a DIFFERENT component
               alert(`Please save or cancel the detail before switching tabs`);
               return false;
          } 
     
          return true;
     }
}