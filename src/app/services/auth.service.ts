import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { LoadingController, AlertController } from '@ionic/angular';

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
