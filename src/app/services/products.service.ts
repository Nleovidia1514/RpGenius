import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { Product } from '../models/product.interface';
import { map, first, switchMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import uuid from 'uuid/v4';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  lastDoc: QueryDocumentSnapshot<Product>;

  constructor(
    private firestore: AngularFirestore,
    private fAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  getSkins(firstLoad: boolean = false) {
    let query: AngularFirestoreCollection<Product>;
    if (firstLoad) {
      query = this.firestore.collection<Product>('skins', ref =>
        ref
          .where('type', '==', 'skin')
          .orderBy('times_bought', 'asc')
          .limit(10)
      );
    } else {
      query = this.firestore.collection<Product>('skins', ref =>
        ref
          .where('type', '==', 'skin')
          .orderBy('times_bought', 'asc')
          .startAfter(this.lastDoc)
          .limit(10)
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
    return products;
  }

  getProduct(productId: string) {
    return this.firestore
      .collection('skins')
      .doc<Product>(productId)
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
  }

  addProductToCart(product: Product) {
    const userDoc = this.firestore.doc(
      `users/${this.fAuth.auth.currentUser.uid}`
    );
    return userDoc.get().pipe(
      map(doc => {
        const cart = doc.data().cart;
        const index = cart.findIndex(prod => prod.ref.id === product.id);
        const prodDoc = this.firestore
          .collection('skins')
          .doc<Product>(product.id);
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
    const userDoc = this.firestore.doc<User>(
      `users/${this.fAuth.auth.currentUser.uid}`
    );
    return userDoc.get().pipe(
      switchMap(doc => {
        const cart = doc.data().cart;
        const index = cart.findIndex(prod => prod.ref.id === product.id);
        cart[index].quantity -= 1;
        if (cart[index].quantity === 0 || whole) {
          cart.splice(index, 1);
        }
        return userDoc.update({ cart });
      }),
      first()
    );
  }

  addNewProduct(product: Product, url: boolean): Observable<any> {
    if (url) {
      return from(
        this.firestore.collection<Product>('skins').add({
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          type: product.type,
          availability: product.availability,
          image: product.image,
          times_bought: 0
        })
      );
    }
    const formattedImage = product.image.replace('data:image/jpeg;base64,', '');
    const id = uuid();
    const imagePath = `product-images/${id}.jpg`;
    return from(
      this.storage
        .ref('')
        .child(imagePath)
        .putString(formattedImage, 'base64', {
          contentType: 'image/jpeg'
        })
    ).pipe(
      first(),
      switchMap(res => {
        return this.storage.ref(imagePath).getDownloadURL();
      }),
      first(),
      switchMap(imageUrl => {
        return from(
          this.firestore
            .collection('skins')
            .doc<Product>(id)
            .set({
              name: product.name,
              description: product.description,
              price: product.price,
              discount: product.discount,
              type: product.type,
              availability: product.availability,
              image: imageUrl,
              times_bought: 0
            })
        );
      }),
      first()
    );
  }

  deleteProduct(product: Product) {
    return from(
      this.firestore
        .collection('skins')
        .doc<Product>(product.id)
        .delete()
    ).pipe(
      first(),
      switchMap(() => {
        return this.storage.ref(`product-images/${product.id}.jpg`).delete();
      })
    );
  }

  modifyProduct(product: Product) {
    return from(
      this.firestore
        .collection('skins')
        .doc<Product>(product.id)
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          type: product.type,
          availability: product.availability,
          image: product.image,
          times_bought: 0
        })
    ).pipe(first());
  }
}
