import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ModalController, IonImg, AlertController, IonInput } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.page.html',
  styleUrls: ['./create-product.page.scss']
})
export class CreateProductPage implements OnInit {
  @ViewChild('productImg', { static: false }) productImg: IonInput;
  productFormGroup: FormGroup;
  imgIsLoading = false;
  prodImg: string;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private productsService: ProductsService,
    private alertCtrl: AlertController,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.productFormGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      availability: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required)
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  array(times: number, start: number = 0) {
    const range = [];
    for (let i = start; i < times + 1; i++) {
      range.push(i);
    }
    return range;
  }

  addNewProduct() {
    this.productsService
      .addNewProduct(this.productFormGroup.value)
      .then(product => {
        this.modalCtrl.dismiss();
        this.toast.show('Nuevo producto agregado con exito');
      });
  }

  selectImageUrl() {
    this.alertCtrl
      .create({
        header: 'Insert Image Url',
        inputs: [
          {
            name: 'url',
            type: 'text',
            placeholder: 'http://example.com/exampleName.jpg'
          }
        ],
        buttons: [
          { text: 'CANCEL', role: 'cancel' },
          {
            text: 'INSERT URL',
            handler: alertData => {
              this.productImg.value = alertData.url;
            }
          }
        ]
      })
      .then(alert => alert.present());
  }

  selectImageFromGallery() {
    console.log(this.productFormGroup);
    this.alertCtrl
      .create({
        header: 'NO SIRVE'
      })
      .then(alert => alert.present());
 }

  startLoadingImg() {
    this.imgIsLoading = true;
  }

  stopLoadingImg() {
    this.imgIsLoading = false;
  }

  setImgPreview() {
    // this.prodImg.src = this.productFormGroup.value.image;
  }
}
