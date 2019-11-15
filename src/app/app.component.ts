import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LayoutPage } from './layout/layout.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fAuth: AngularFireAuth,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fAuth.authState.subscribe(user => {
      const shouldRedirect = this.activeRoute.firstChild.firstChild.component !== LayoutPage;
      if (user && !shouldRedirect) {
        this.router.navigateByUrl('/layout/explore');
        console.log(user);
      } else {
        this.router.navigateByUrl('/login');
        console.log(user);
      }
    });
    });
  }

}
