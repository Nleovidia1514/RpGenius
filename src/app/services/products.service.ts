import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private firestore: AngularFirestore) {}

  getSkins() {
    const skins = this.firestore
      .collection<Product>('skins', ref => ref.where('type', '==', 'skin'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    console.log(skins);
    return skins;
  }

  getRpCards() {
    const cards = this.firestore
      .collection<Product>('skins', ref => ref.where('type', '==', 'card'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    console.log(cards);
    return cards;
  }

  getBundles() {
    const bundles = this.firestore
      .collection<Product>('skins', ref => ref.where('type', '==', 'bundle'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    console.log(bundles);
    return bundles;
  }
}
