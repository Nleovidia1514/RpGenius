import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-verify-credentials',
  templateUrl: './verify-credentials.page.html',
  styleUrls: ['./verify-credentials.page.scss']
})
export class VerifyCredentialsPage implements OnInit {
  loginFormGroup: FormGroup;
  showPassword = false;
  loading = false;
  @Input() action: () => void;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalCtrl: ModalController
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
    this.authService.reauthenticateUser(this.loginFormGroup.value).subscribe(
      () => {
        this.loading = false;
        this.action();
      },
      err => {
        this.loading = false;
        console.error(err);
      }
    );
  }
}
