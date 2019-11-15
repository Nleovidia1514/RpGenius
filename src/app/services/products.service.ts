import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import { Product } from '../models/product.interface';
import { map, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  lastDoc: QueryDocumentSnapshot<Product>;

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    private fAuth: AngularFireAuth
  ) {   
  }

  getSkins(firstLoad: boolean = false) {
    // tslint:disable-next-line: max-line-length
    this.http
      .get(
        'http://ddragon.leagueoflegends.com/cdn/9.22.1/data/en_US/champion/MasterYi.json?api_key=RGAPI-e1aaa260-cee1-4606-a37a-72d153e0f8e4'
      )
      .subscribe(data => console.log(data));
    let query: AngularFirestoreCollection<Product>;
    if (firstLoad) {
      query = this.firestore.collection<Product>('skins', ref =>
        ref
          .where('type', '==', 'skin')
          .orderBy('times_bought', 'asc')
          .limit(15)
      );
    } else {
      query = this.firestore.collection<Product>('skins', ref =>
        ref
          .where('type', '==', 'skin')
          .orderBy('times_bought', 'asc')
          .startAfter(this.lastDoc)
          .limit(15)
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

  getAllProducts() {
    const products = this.firestore
      .collection<Product>('skins')
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
    console.log(products);
    return products;
  }

  getProduct(productId: string) {
    const pro: Observable<Product> = this.firestore
      .doc<Product>('skins/' + productId)
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
    const userDoc = this.firestore.doc(
      `users/${this.fAuth.auth.currentUser.uid}`
    );
    return userDoc.get().pipe(
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
        userDoc.update({ cart });
        if (newP) {
          return { quantity: 1, ref: prodDoc.ref };
        }
        return { quantity: toUpdate.quantity, ref: prodDoc.ref };
      }),
      first()
    );
  }

  removeProductFromCart(product: Product, whole = false) {
    const userDoc = this.firestore.doc(
      `users/${this.fAuth.auth.currentUser.uid}`
    );
    return userDoc.get().pipe(
      map(doc => {
        const cart = doc.data().cart;
        const index = cart.findIndex(prod => prod.ref.id === product.id);
        cart[index].quantity -= 1;
        if (cart[index].quantity === 0 || whole) {
          cart.splice(index, 1);
        }
        userDoc.update({ cart });
      }),
      first()
    );
  }

  addNewProduct(product: Product) {
    return this.firestore.collection<Product>('skins').add({
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      type: product.type,
      availability: product.availability,
      image: product.image,
      times_bought: 0
    });
  }

  deleteProduct(product: Product) {
    return this.firestore.doc('skins/'+ product.id).delete();
  }
}
