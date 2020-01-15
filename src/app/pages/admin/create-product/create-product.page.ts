import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  ModalController,
  AlertController,
  IonInput,
  LoadingController
} from '@ionic/angular';
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
  isImageUrl = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private productsService: ProductsService,
    private toast: ToastService,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.productFormGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      discount: new FormControl('', [Validators.required, Validators.min(0)]),
      type: new FormControl('', Validators.required),
      availability: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required)
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
    this.loadCtrl
      .create({
        message: 'Creating Product...'
      })
      .then(load => {
        load.present();
        this.productsService
          .addNewProduct(this.productFormGroup.value, this.isImageUrl)
          .subscribe(
            res => {
              load.dismiss();
              this.modalCtrl.dismiss();
              this.toast.show('Nuevo producto agregado con exito');
            },
            error => {
              load.dismiss();
              console.log(error);
              this.alertCtrl
                .create({
                  header: 'An error has ocurred.',
                  subHeader: 'Please try again later.',
                  message: error,
                  buttons: ['OK']
                })
                .then(alert => alert.present());
            }
          );
      });
  }

  onImagePicked(image: string, url = false) {
    this.isImageUrl = url;
    this.productFormGroup.patchValue({ image });
  }
}
