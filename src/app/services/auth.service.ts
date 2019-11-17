import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { map, first } from 'rxjs/operators';
import { of } from 'rxjs';

interface RegisterValues {
  firstName: string;
  lastName: string;
  displayName: string;
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
    return this.fAuth.authState.pipe(
      map(user => {
        if (user !== null) {
          return this.firestore
            .doc<User>(`users/${user.uid}`)
            .snapshotChanges()
            .pipe(
              map(doc => {
                return { ...doc.payload.data(), email: user.email } as User;
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  registerWithEmailAndPass(values: RegisterValues) {
    return new Promise(resolve => {
      this.fAuth.auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then(res => {
          const userId = this.fAuth.auth.currentUser.uid;
          const userDoc = this.firestore.doc<User>('users/' + userId);
          userDoc.set({
            firstName: values.firstName,
            lastName: values.lastName,
            displayName: values.displayName,
            cart: [],
            isAdmin: false
          });
          resolve(null);
        })
        .catch(err => {
          console.error(err);
          resolve(err.message);
        });
    });
  }

  modifyUser(values: User) {
    return new Promise<User>((resolve, reject) => {
      this.fAuth.authState.pipe(first()).subscribe(user => {
        if (user) {
          user.updateEmail(values.email);
          this.firestore
            .doc<User>('users/' + user.uid)
            .update({
              firstName: values.firstName,
              lastName: values.lastName,
              displayName: values.displayName,
              cart: values.cart,
              isAdmin: values.isAdmin
            })
            .then(res => {
              resolve(null);
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
      });
    });
  }

  loginWithEmailAndPass(values: LoginValues) {
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
