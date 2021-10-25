import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
//import { HTTP } from '@ionic-native/http/ngx';
//import { File } from '@ionic-native/file/ngx';

@NgModule({
    imports: [ HttpClientModule ],
    providers: [ DataService ]
})
export class CoreModule { }
