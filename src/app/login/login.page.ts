import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginFormGroup: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) {}

  ionViewDidLeave() {
    this.loginFormGroup.get('email').reset();
    this.loginFormGroup.get('password').reset();
  }

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

  login() {
    console.log('hi');
    this.loading = true;
    this.authService
      .loginUser(this.loginFormGroup.value)
      .then(res => {
        this.loading = false;
        this.router.navigateByUrl('/layout/explore');
      })
      .catch(err => {
        this.loading = false;
        this.toast.show(err.message);
      });
  }
}
