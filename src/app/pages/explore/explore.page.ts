import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product.interface';
import { IonSlides } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss']
})
export class ExplorePage implements OnInit {
  @ViewChild(IonSlides, { static: false}) slides: IonSlides;
  activeTab = 0;
  skins: Product[];

  exploreSegments = [
    { name: 'Skins' },
    { name: 'Riot Points' },
    { name: 'Bundles' }
  ];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getSkins().subscribe(res => this.skins = res);
  }

  async segmentChanged() {
    await this.slides.slideTo(this.activeTab);
  }

  async slideChange() {
    this.activeTab = await this.slides.getActiveIndex();
  }

  addToCart = (product: Product)  => {
  
  }
}
