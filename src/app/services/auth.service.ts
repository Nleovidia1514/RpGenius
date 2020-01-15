import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { map, first, switchMap, tap } from 'rxjs/operators';
import { of, from, BehaviorSubject, Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

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
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private userSub: Subscription;

  constructor(
    private fAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.userSub = this.getUserObservable().subscribe(user => {
      this._user.next(user);
    });
  }


  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  getCurrentUser() {
    return this._user.asObservable();
  }

  getUserObservable() {
    let userEmail: string;
    return this.fAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          userEmail = user.email;
          return this.firestore
            .doc<User>(`users/${user.uid}`)
            .snapshotChanges();
        } else {
          return of(null);
        }
      }),
      map(doc => {
        if (doc) {
          return { ...doc.payload.data(), email: userEmail } as User;
        }
      })
    );
  }

  registerWithEmailAndPass(values: RegisterValues) {
    return from(
      this.fAuth.auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )
    ).pipe(
      switchMap(res => {
        const userId = this.fAuth.auth.currentUser.uid;
        if (userId) {
          const userDoc = this.firestore.doc<User>('users/' + userId);
          return userDoc.set({
            firstName: values.firstName,
            lastName: values.lastName,
            displayName: values.displayName,
            cart: [],
            isAdmin: false
          });
        }
        return of(null);
      })
    );
  }

  modifyUser(values: User) {
    let userId: string;
    return this.fAuth.authState.pipe(first()).pipe(
      switchMap(user => {
        if (user) {
          userId = user.uid;
          return from(user.updateEmail(values.email));
        }
        return of(null);
      }),
      first(),
      switchMap(() => {
        if (userId) {
          return this.firestore.doc<User>('users/' + userId).update({
            firstName: values.firstName,
            lastName: values.lastName,
            displayName: values.displayName,
            cart: values.cart,
            isAdmin: values.isAdmin
          });
        }
        return of(null);
      }),
      first()
    );
  }

  modifyPassword(newPass: string) {
    return from(this.fAuth.auth.currentUser.updatePassword(newPass)).pipe(
      first()
    );
  }

  deleteUser() {
    const currentUser = this.fAuth.auth.currentUser;
    return from(this.firestore.doc('users/' + currentUser.uid).delete()).pipe(
      first(),
      switchMap(res => {
        return currentUser.delete();
      })
    );
  }

  reauthenticateUser(values: LoginValues) {
    const user = this.fAuth.auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      values.email,
      values.password
    );
    return from(user.reauthenticateWithCredential(credential)).pipe(first());
  }

  loginWithEmailAndPass(values: LoginValues) {
    return from(
      this.fAuth.auth.signInWithEmailAndPassword(values.email, values.password)
    ).pipe(first());
  }

  logoutUser() {
    return from(this.fAuth.auth.signOut()).pipe(first());
  }
}
