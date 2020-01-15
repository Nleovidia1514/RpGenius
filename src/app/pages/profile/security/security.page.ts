import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss']
})
export class SecurityPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  passwordFormGroup: FormGroup;
  changePassFormGroup: FormGroup = null;
  changesSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private fAuth: AngularFireAuth,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.passwordFormGroup = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        confirmPassword: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.minLength(6)])
        )
      },
      (fg: FormGroup) => this.arePasswordsEqual(fg)
    );
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  changeSubmitted() {
    this.changesSent = true;
    this.authService
      .reauthenticateUser({
        email: this.fAuth.auth.currentUser.email,
        password: this.changePassFormGroup.value.currentPass
      })
      .subscribe(() => this.changePassword());
  }

  changePassword() {
    this.authService
      .modifyPassword(this.passwordFormGroup.value.password)
      .subscribe(
        () => {
          this.changesSent = false;
          this.toast.show('La contraseña ha sido cambiada con exito');
        },
        err => {
          this.changesSent = false;
          this.toast.show(err);
        }
      );
  }

  arePasswordsEqual(fg: FormGroup) {
    let val;
    let valid = true;

    for (const key in fg.controls) {
      if (fg.controls.hasOwnProperty(key)) {
        const control: FormControl = fg.controls[key] as FormControl;
        if (val === undefined) {
          val = control.value;
        } else {
          if (control.value !== val) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) {
      return null;
    }
    return {
      areEqual: true
    };
  }

  async moveTo(index: number) {
    console.log(this.changePassFormGroup);
    if (index === 1 && this.changePassFormGroup === null) {
      this.changePassFormGroup = this.formBuilder.group({
        currentPass: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        newPassword: this.passwordFormGroup
      });
    }
    await this.slides.lockSwipes(false);
    await this.slides.slideTo(index);
    await this.slides.lockSwipes(true);
  }
}
