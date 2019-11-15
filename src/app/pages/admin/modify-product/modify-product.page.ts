import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.page.html',
  styleUrls: ['./modify-product.page.scss'],
})
export class ModifyProductPage implements OnInit {

  loadedProduct: Product;

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController, private productsService: ProductsService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('productId')) {
        this.navCtrl.pop();
        return;
      }
      const productId = paramMap.get('productId');
      this.productsService.getProduct(productId).toPromise().then(product => {
        this.loadedProduct = product;
      });
    });
  }

}
