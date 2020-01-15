import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonTextarea } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.interface';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.page.html',
  styleUrls: ['./modify-product.page.scss']
})
export class ModifyProductPage implements OnInit {
  @ViewChild('name', { static: false }) name: IonInput;
  @ViewChild('description', { static: false }) description: IonTextarea;
  @ViewChild('price', { static: false }) price: IonInput;
  @ViewChild('times_bought', { static: false }) times_bought: IonInput;
  loadedProduct: Product;
  productFormGroup: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('productId')) {
        this.location.back();
        return;
      }
      const productId = paramMap.get('productId');
      this.productsService
        .getProduct(productId)
        .toPromise()
        .then(product => {
          this.loadedProduct = product;
          this.productFormGroup = this.formBuilder.group({
            name: new FormControl(product.name, Validators.required),
            description: new FormControl(
              product.description,
              Validators.required
            ),
            price: new FormControl(
              product.price,
              Validators.compose([Validators.required, Validators.min(0)])
            ),
            discount: new FormControl(
              product.discount,
              Validators.compose([Validators.required, Validators.max(100)])
            ),
            image: new FormControl(product.image, Validators.required),
            times_bought: new FormControl(
              product.times_bought,
              Validators.compose([Validators.required, Validators.min(0)])
            ),
            availability: new FormControl(
              product.availability,
              Validators.required
            ),
            type: new FormControl(product.type, Validators.required)
          });
        });
    });
  }

  allowModify(field: string) {
    [this.name, this.description, this.price].forEach(element => {
      element.readonly = true;
    });
    this[field].readonly = false;
    this[field].setFocus();
  }

  array(times: number, start: number = 0) {
    const range = [];
    for (let i = start; i < times + 1; i++) {
      range.push(i);
    }
    return range;
  }

  saveChanges() {
    this.productsService
      .modifyProduct({
        id: this.loadedProduct.id,
        ...this.productFormGroup.value
      })
      .subscribe(
        res => {
          this.toast.show('Producto modificado con exito');
        },
        err => {
          console.error(err);
          this.toast.show('Error al modificar el product');
        }
      );
  }
}
