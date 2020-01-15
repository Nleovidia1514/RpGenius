import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  private authSub: Subscription;
  private previousAuthState = true;

  initializeApp() {
    this.platform.ready().then(() => {
	this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
  }

  ngOnInit() {
    this.authSub = this.fAuth.authState.subscribe(user => {
      if (!user && this.previousAuthState !== !!user) {
        this.router.navigate(['/login']);
      }
      this.previousAuthState = !!user;
    }, error => {
      this.alertCtrl.create({
        message: error
      }).then(alert => alert.present());
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
