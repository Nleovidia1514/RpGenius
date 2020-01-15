import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import {
  ModalController,
  AlertController,
  NavController
} from '@ionic/angular';
import { VerifyCredentialsPage } from './security/verify-credentials/verify-credentials.page';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit, OnDestroy {
  options = [
    {
      name: 'Mis Datos',
      url: 'data'
    },
    {
      name: 'Mis Compras',
      url: 'purchases'
    },
    {
      name: 'Seguridad',
      url: 'security'
    }
  ];

  userSub: Subscription;
  user: User;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private nav: NavController,
    private alertCtrl: AlertController,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  confirmAction() {
    this.alertCtrl
      .create({
        header: '¿ESTA SEGURO?',
        message: '¿Esta seguro que desea eliminar su cuenta?',
        buttons: [
          { text: 'CANCEL', role: 'cancel' },
          {
            text: 'ELIMINAR',
            handler: () => {
              this.modalCtrl
                .create({
                  component: VerifyCredentialsPage,
                  componentProps: {
                    action: this.deleteAccount
                  }
                })
                .then(modal => modal.present());
            }
          }
        ]
      })
      .then(alert => alert.present());
  }

  deleteAccount = () => {
    this.authService.deleteUser().subscribe(
      res => {
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/login');
        this.toast.show('El usuario ha sido eliminado');
      },
      err => {
        console.error(err);
      }
    );
  };

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
