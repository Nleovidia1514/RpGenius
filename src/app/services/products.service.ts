import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import { Product } from '../models/product.interface';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  lastDoc: QueryDocumentSnapshot<Product>;
  userDoc: AngularFirestoreDocument<User> = this.firestore.doc(
    `users/${this.fAuth.auth.currentUser.uid}`
  );

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    private fAuth: AngularFireAuth
  ) {}

  getSkins(first: boolean = false) {
    // tslint:disable-next-line: max-line-length
    this.http
      .get(
        'http://ddragon.leagueoflegends.com/cdn/9.22.1/data/en_US/champion/MasterYi.json?api_key=RGAPI-e1aaa260-cee1-4606-a37a-72d153e0f8e4'
      )
      .subscribe(data => console.log(data));
    let query: AngularFirestoreCollection<Product>;
    if (first) {
      query = this.firestore.collection<Product>('skins', ref =>
        ref
          .where('type', '==', 'skin')
          .orderBy('times_bought', 'asc')
          .limit(25)
      );
    } else {
      query = this.firestore.collection<Product>('skins', ref =>
        ref
          .where('type', '==', 'skin')
          .orderBy('times_bought', 'asc')
          .startAfter(this.lastDoc)
          .limit(25)
      );
    }

    const skins: Observable<Product[]> = query.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.lastDoc = a.payload.doc;
          return { id, ...data };
        });
      })
    );
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

  getProduct(product: DocumentReference) {
    const pro: Observable<Product> = this.firestore
      .doc<Product>(product)
      .get()
      .pipe(
        map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            image: data.image,
            description: data.description,
            price: data.price,
            discount: data.discount,
            times_bought: data.times_bought,
            availability: data.availability,
            type: data.type
          };
        })
      );
    return pro;
  }

  addProductToCart(product: Product) {
    return this.userDoc.get().pipe(
      map(doc => {
        const cart = doc.data().cart;
        const index = cart.findIndex(prod => prod.ref.id === product.id);
        const prodDoc = this.firestore.doc<Product>(`skins/${product.id}`);
        const toUpdate = cart.find(prod => prod.ref.id === product.id);
        let newP = false;
        if (index < 0) {
          newP = true;
          cart.push({ quantity: 1, ref: prodDoc.ref });
        } else {
          toUpdate.quantity += 1;
          cart[index] = toUpdate;
        }
        this.userDoc.update({ cart });
        if (newP) {
          return { quantity: 1, ref: prodDoc.ref };
        }
        return { quantity: toUpdate.quantity, ref: prodDoc.ref };
      })
    );
  }

  removeProductFromCart(product: Product, whole = false) {
    return this.userDoc.get().pipe(
      map(doc => {
        const cart = doc.data().cart;
        const index = cart.findIndex(prod => prod.ref.id === product.id);
        cart[index].quantity -= 1;
        if (cart[index].quantity === 0 || whole) {
          cart.splice(index, 1);
        }
        this.userDoc.update({ cart });
      })
    );
  }
}
