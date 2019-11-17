import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastService } from '../services/toast.service';

@Injectable()
export class EmailValidator {
  private debouncer: any;

  constructor(private fAuth: AngularFireAuth, private toast: ToastService) {}

  validEmail(fc: FormControl) {
    clearTimeout(this.debouncer);

    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        this.fAuth.auth.fetchSignInMethodsForEmail(fc.value).then(methods => {
          if (methods.length !== 0) {
            this.toast.show('This email is already in use!');
            resolve({ emailInUse: true });
          } else {
            resolve(null);
          }
        });
      }, 1000);
    });
  }

  validModify(fc: FormControl) {
    clearTimeout(this.debouncer);
    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        this.fAuth.auth.fetchSignInMethodsForEmail(fc.value).then(methods => {
          if (methods.length !== 0) {
            this.fAuth.authState.subscribe(user => {
              if (user.email === fc.value) {
                resolve(null);
              } else {
                this.toast.show('This email is already in use!');
                resolve({ emailInUse: true });
              }
            });
          } else {
            resolve(null);
          }
        });
      }, 1000);
    });
  }
}
