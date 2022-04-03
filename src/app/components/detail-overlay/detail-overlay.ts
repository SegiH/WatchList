import { Component } from '@angular/core';
import { DataService } from '../../core/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
     selector: 'app-detailoverlay',
     templateUrl: 'detail-overlay.page.html',
     styleUrls: ['detail-overlay.page.scss']
})
export class DetailOverlay {
     detailObjectName: string;
    
     constructor(public dataService: DataService, private router: Router, private route: ActivatedRoute) {}

     ngDoCheck() {
          this.detailObjectName=this.route.snapshot.paramMap.get("ObjectName")
          
          if (this.detailObjectName == null)
               this.router.navigateByUrl('/')
     }
}