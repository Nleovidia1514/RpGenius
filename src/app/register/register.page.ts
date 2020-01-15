import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { EmailValidator } from '../validators/email.validator';
import { AuthService } from '../services/auth.service';
import {
  LoadingController,
  AlertController,
  NavController
} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  registerFormGroup: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private emailValidator: EmailValidator,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerFormGroup = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email]),
        (fc: FormControl) => {
          return this.emailValidator.validEmail(fc);
        }
      ),
      password: new FormControl('', Validators.required)
    });
  }

  register() {
    this.loadingCtrl
      .create({
        message: 'Please wait...'
      })
      .then(loading => loading.present());
    this.authService
      .registerWithEmailAndPass(this.registerFormGroup.value)
      .subscribe(
        res => {
          this.loadingCtrl.dismiss();
          this.registerFormGroup.reset();
          this.router.navigate(['/layout/explore']);
        },
        error => {
          this.alertCtrl
            .create({
              message: error,
              buttons: ['OK']
            })
            .then(alert => {
              this.loadingCtrl.dismiss();
              alert.present();
            });
        }
      );
  }

  showPass() {
    this.showPassword = !this.showPassword;
  }
}
