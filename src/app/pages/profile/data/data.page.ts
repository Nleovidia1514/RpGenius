import { Component, OnInit } from '@angular/core';
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
import { ModalController } from '@ionic/angular';
import { VerifyCredentialsPage } from '../security/verify-credentials/verify-credentials.page';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss']
})
export class DataPage implements OnInit {
  dataFormGroup: FormGroup;
  user: User;
  changesSent = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private emailVal: EmailValidator,
    private toast: ToastService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const authOb = this.authService.getCurrentUser().subscribe(userDocObs => {
      userDocObs.subscribe(user => {
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
      authOb.unsubscribe();
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
          updateValues: this.user
        }
      })
      .then(modal => modal.present());
  }
}
