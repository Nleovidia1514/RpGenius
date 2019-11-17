import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product.interface';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage implements OnInit {
  user: User;
  cartProducts: Product[] = [];
  total = 0;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    const authOb = this.authService.getCurrentUser().subscribe(userDocObs => {
      userDocObs.subscribe(user => {
        this.user = user;
        this.user.cart.forEach(product => {
          this.productsService.getProduct(product.ref.id).subscribe(p => {
            if (this.cartProducts.findIndex(pro => pro.name === p.name) < 0) {
              this.cartProducts.push(p);
              this.calculateTotal();
            }
          });
        });
        
        authOb.unsubscribe();
      });
    });
  }

  ionViewDidEnter() {}

  checkout() {}

  addOneToCart(product: Product) {
    this.productsService.addProductToCart(product).subscribe(res => {
      this.user.cart[
        this.user.cart.findIndex(p => p.ref.id === product.id)
      ].quantity += 1;
      this.calculateTotal();
    });
  }

  removeOneFromCart(product: Product) {
    const prodIndex = this.user.cart.findIndex(p => p.ref.id === product.id);
    this.user.cart[prodIndex].quantity -= 1;
    if (this.user.cart[prodIndex].quantity === 0) {
      this.user.cart.splice(prodIndex, 1);
      this.cartProducts.splice(
        this.cartProducts.findIndex(p => p.id === product.id),
        1
      );
    }
    this.productsService
      .removeProductFromCart(product)
      .subscribe(res => this.calculateTotal());
  }

  removeFromCart(product: Product) {
    const prodIndex = this.user.cart.findIndex(p => p.ref.id === product.id);
    this.user.cart[prodIndex].quantity = 0;
    if (this.user.cart[prodIndex].quantity === 0) {
      this.user.cart.splice(prodIndex, 1);
      this.cartProducts.splice(
        this.cartProducts.findIndex(p => p.id === product.id),
        1
      );
    }
    this.productsService
      .removeProductFromCart(product, true)
      .subscribe(res => this.calculateTotal());
  }

  helperCheck(product) {
    return p => p.ref.id === product.id;
  }

  calculateTotal() {
    this.total = 0;
    this.cartProducts.forEach(p => {
      this.total +=
        this.user.cart[this.user.cart.findIndex(prod => prod.ref.id === p.id)]
          .quantity * p.price;
    });
  }
}
