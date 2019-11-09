import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  showPassword = false;
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  showPass() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.loading = true;
    this.authService.loginUser({email: this.email, password: this.password}).then(res => {
      this.loading = false;
      this.router.navigate(['layout','explore']);
    }).catch(err => {
      this.loading = false;
    });
  }

}
