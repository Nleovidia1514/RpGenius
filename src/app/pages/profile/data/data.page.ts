import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EmailValidator } from 'src/app/validators/email.validator';
import { ToastService } from 'src/app/services/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { VerifyCredentialsPage } from '../security/verify-credentials/verify-credentials.page';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss']
})
export class DataPage implements OnInit, OnDestroy {
  dataFormGroup: FormGroup;
  user: User;
  changesSent = false;
  userSub: Subscription;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private emailVal: EmailValidator,
    private toast: ToastService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.userSub = this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.dataFormGroup = this.formBuilder.group({
        firstName: new FormControl(user.firstName, Validators.required),
        lastName: new FormControl(user.lastName, Validators.required),
        displayName: new FormControl(user.displayName, Validators.required),
        email: new FormControl(
          user.email,
          Validators.compose([Validators.required, Validators.email]),
          [(fc: FormControl) => this.emailVal.validModify(fc)]
        )
      });
    });
  }

  saveChanges() {
    const values = this.dataFormGroup.value;
    this.user.firstName = values.firstName;
    this.user.lastName = values.lastName;
    this.user.displayName = values.displayName;
    this.user.email = values.email;
    this.changesSent = true;
    this.modalCtrl
      .create({
        component: VerifyCredentialsPage,
        componentProps: {
          action: this.successLogin
        }
      })
      .then(modal => modal.present());
  }

  successLogin = () => {
    this.authService.modifyUser(this.user).subscribe(
      () => {
        this.changesSent = false;
        this.toast.show('El usuario ha sido modificado con exito');
        this.modalCtrl.dismiss();
        this.navCtrl.navigateBack('/layout/profile');
      },
      err => {
        console.error(err);
        this.changesSent = false;
        this.toast.show('Ha ocurrido un error al modificar el usuario');
      }
    );
  };

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
