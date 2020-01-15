import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductComponent } from './product/product.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { ExploreSkeletonComponent } from './explore-skeleton/explore-skeleton.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [ProductComponent, ProductManagerComponent, ExploreSkeletonComponent, ImagePickerComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [Camera],
  exports: [ProductComponent, ProductManagerComponent, ExploreSkeletonComponent, ImagePickerComponent]
})
export class ComponentsModule { }
