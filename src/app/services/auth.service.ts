import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { LoadingController, AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginValues {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  getCurrentUser() {
    return new Promise<User>(resolve => {
      const obs: Observable<User> = this.firestore
        .doc<User>(`users/${this.fAuth.auth.currentUser.uid}`)
        .get()
        .pipe(
          map(doc => {
            const data = doc.data();
            return {
              cart: data.cart,
              email: data.email,
              firstName: data.firstName,
              isAdmin: data.isAdmin,
              lastName: data.lastName
            };
          })
        );
      obs.subscribe(user => {
        this.currentUser = user;
        resolve(user);
      });
    });
  }

  registerUser(values: RegisterValues) {
    return new Promise(resolve => {
      this.fAuth.auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then(res => {
          const userId = this.fAuth.auth.currentUser.uid;
          const userDoc = this.firestore.doc<User>('users/' + userId);
          userDoc.set({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            cart: [],
            isAdmin: false
          });
          resolve(null);
        })
        .catch(err => {
          resolve(err.message);
        });
    });
  }

  loginUser(values: LoginValues) {
    return new Promise((resolve, reject) => {
      this.fAuth.auth
        .signInWithEmailAndPassword(values.email, values.password)
        .then(res => {
          resolve(res.user);
        })
        .catch(err => {
          console.error(err);
          reject({ message: err.message });
        });
    });
  }

  logoutUser() {
    return new Promise(resolve => {
      this.fAuth.auth.signOut().then(res => {
        resolve(null);
      });
    });
  }
}
