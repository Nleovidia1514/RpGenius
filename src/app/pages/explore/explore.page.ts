import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product.interface';
import { IonSlides, IonInfiniteScroll } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss']
})
export class ExplorePage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @ViewChild('ionInfScroll1', { static: false }) skinsScroll: IonInfiniteScroll;
  activeTab = 0;
  skins: Product[] = [];
  cards: Product[] = [];
  bundles: Product[] = [];
  user: User;

  exploreSegments = [
    { name: 'Skins' },
    { name: 'Riot Points' },
    { name: 'Bundles' }
  ];

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.productsService.getSkins(true).subscribe(res => (this.skins = res));
    this.productsService.getRpCards().subscribe(res => (this.cards = res));
    this.productsService.getBundles().subscribe(res => (this.bundles = res));
    const authOb = this.authService.getCurrentUser().subscribe(userDocObs => {
      return userDocObs.subscribe(user => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
        authOb.unsubscribe();
      });
    });
  }

  loadMoreSkins() {
    this.productsService.getSkins().subscribe(res => {
      if (res.length === 0) {
        return;
      }
      this.skins = [...this.skins, ...res];
    });
  }

  async segmentChanged() {
    await this.slides.slideTo(this.activeTab);
  }

  async slideChange() {
    const activeIndex = await this.slides.getActiveIndex();
    this.activeTab = await this.slides.getActiveIndex();
  }

  addToCart = (product: Product) => {
    this.productsService
      .addProductToCart(product)
      .subscribe(res => this.user.cart.push(res));
    this.toast.show('Added to cart!');
  };

  cartTotal() {
    let total = 0;
    this.user.cart.forEach(prod => {
      total += prod.quantity;
    });
    return total;
  }
}
