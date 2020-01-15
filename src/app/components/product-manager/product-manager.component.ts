import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.interface';
import { Subscription } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { CreateProductPage } from 'src/app/pages/admin/create-product/create-product.page';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss']
})
export class ProductManagerComponent implements OnInit, OnDestroy {
  productsSubscription: Subscription;
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private toast: ToastService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.productsSubscription = this.productsService
      .getAllProducts()
      .subscribe(products => {
        this.products = products;
      });
  }

  ionViewWillEnter() {}

  ngOnDestroy() {}

  travelToModifyPage(product: Product) {
    this.router.navigate(['layout', 'admin', 'product', 'modify', product.id]);
  }

  addNewProduct() {
    this.modalCtrl
      .create({
        component: CreateProductPage
      })
      .then(modal => modal.present());
  }

  deleteProduct(product: Product) {
    this.alertCtrl
      .create({
        header: '¿Estas seguro?',
        message:
          '¿Estas completamente seguro de que quieres eliminar este producto permanentemente?',
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel'
          },
          {
            text: 'DELETE',
            cssClass: 'caution',
            handler: e => {
              this.productsService.deleteProduct(product).subscribe(res => {
                this.toast.show('El producto ha sido eliminado');
              });
            }
          }
        ]
      })
      .then(alert => alert.present());
  }

  array(times: number) {
    const range = [];
    for (let i = 1; i < times + 1; i++) {
      range.push(i);
    }
    return range;
  }
}
