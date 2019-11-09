import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from '../models/user.interface';

@Injectable()
export class EmailValidator {
  private debouncer: any;

  constructor(private firestore: AngularFirestore) {}

  validEmail(fc: FormControl) {
    clearTimeout(this.debouncer);

    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        console.log(fc.value);
        this.firestore
          .collection<any>('users', ref => ref.where('email', '==', fc.value))
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          )
          .subscribe((userList: User[]) => {
            if (userList.length !== 0) { resolve({ emailInUse: true }); } else { resolve(null); }
          });
      }, 1000);
    });
  }
}
