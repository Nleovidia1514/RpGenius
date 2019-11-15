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
  user: User = {
    email: '',
    firstName: '',
    isAdmin: false,
    lastName: '',
    cart: [],
    displayName: ''
  };

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

  array(times: number) {
    const range = [];
    for (let i = 1; i < times + 1; i++) {
      range.push(i);
    }
    return range;
  }

  ngOnInit() {
    this.productsService.getSkins(true).subscribe(res => (this.skins = res));
    this.authService.getCurrentUser().then(user => (this.user = user));
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
    this.activeTab = await this.slides.getActiveIndex();
  }

  addToCart = (product: Product) => {
    this.productsService
      .addProductToCart(product)
      .subscribe(res => this.user.cart.push(res));
    this.toast.show('Added to cart!');
  };
}
