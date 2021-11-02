import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {  constructor(public dataService: DataService, public router: Router) {}  canActivate(): boolean {
     if (this.dataService.isAdding || this.dataService.isEditing) {
          alert("Please save before switching tabs");
          return false;
     }
     return true;
  }}