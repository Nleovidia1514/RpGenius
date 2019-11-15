import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { map, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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
    return new Promise<User>(resolve => {
      this.fAuth.authState
        .pipe(
          first(),
          map(user => {
            if (user !== null) {
              return this.firestore
              .doc<User>(`users/${user.uid}`)
              .get()
              .pipe(
                first(),
                map(doc => {
                  return { ...doc.data() } as User;
                })
              );
            } else {
              return of(null);
            } 
          })
        )
        .subscribe(userDocObs => {
          userDocObs.subscribe(user => {
            if (user) {
              resolve(user);
            } else {
              resolve(null);
            }
          });
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
            displayName: values.displayName,
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
