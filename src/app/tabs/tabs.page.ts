import { Component } from '@angular/core';
import { DataService } from '../core/data.service';

@Component({
     selector: 'app-tabs',
     templateUrl: 'tabs.page.html',
     styleUrls: ['tabs.page.scss']
})

export class TabsPage {
     IMDBSearchEnabled = false;

     constructor(public dataService: DataService) {
          this.dataService.isIMDBSearchEnabled().subscribe((response) => {
               this.IMDBSearchEnabled=response;
          },
          error => {
               alert(`The error ${error.error.toString()} occurred calling isIMDBSearchEnabled() in TabsPage`)
          });
      }
}
