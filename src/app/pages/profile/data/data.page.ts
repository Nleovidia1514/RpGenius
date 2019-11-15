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

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss']
})
export class DataPage implements OnInit {
  dataFormGroup: FormGroup;
  user: User = {
    email: '',
    firstName: '',
    isAdmin: false,
    lastName: '',
    cart: [],
    displayName: ''
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private emailVal: EmailValidator
  ) {}

  ngOnInit() {
    this.dataFormGroup = this.formBuilder.group({
      firstName: new FormControl(
        'user.firstName',
        Validators.required,
        (fc: FormControl) => this.isEqual(fc, 'firstName')
      ),
      lastName: new FormControl(
        'user.lastName',
        Validators.required,
        (fc: FormControl) => this.isEqual(fc, 'lastName')
      ),
      email: new FormControl(
        'user.email',
        Validators.compose([Validators.required, Validators.email]),
        [
          (fc: FormControl) => this.emailVal.validEmail(fc),
          (fc: FormControl) => this.isEqual(fc, 'lastName')
        ]
      )
    });
  }

  ionViewDidEnter() {
    

    this.authService.getCurrentUser().then(user => {
      this.user = user;
      
    });
  }

  saveChanges() {}

  isEqual(fc: FormControl, field: string) {
    return new Promise(resolve => {
      if (this.user[field] === fc.value) {
        resolve(null);
      } else {
        resolve({ equal: true });
      }
    });
  }
}
