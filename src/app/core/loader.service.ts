// loader.service.ts
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(public loadingController: LoadingController) { }

  // This will show then autohide the loader
  showHideAutoLoader() {

    this.loadingController.create({
      message: 'This Loader Will Auto Hide in 2 Seconds',
      duration: 2000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });

  }


  // Show the loader for infinite time
  showLoader() {

    this.loadingController.create({
      message: ''
    }).then((res) => {
      res.present();
    });

  }

  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }

}
