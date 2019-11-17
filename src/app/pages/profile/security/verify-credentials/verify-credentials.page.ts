import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-verify-credentials',
  templateUrl: './verify-credentials.page.html',
  styleUrls: ['./verify-credentials.page.scss']
})
export class VerifyCredentialsPage implements OnInit {
  loginFormGroup: FormGroup;
  showPassword = false;
  loading = false;
  @Input() updateValues: User;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private toast: ToastService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      )
    });
  }

  showPass() {
    this.showPassword = !this.showPassword;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  loginWithEmail() {
    this.loading = true;
    this.authService
      .loginWithEmailAndPass(this.loginFormGroup.value)
      .then(res => {
        this.authService
          .modifyUser(this.updateValues)
          .then(response => {
            this.loading = false;
            this.toast.show('El usuario ha sido modificado con exito');
            this.modalCtrl.dismiss();
            this.location.back();
          })
          .catch(err => {
            console.error(err);
            this.toast.show('Ha ocurrido un error al modificar el usuario');
          });
      });
  }
}
