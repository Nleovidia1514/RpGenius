import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductComponent } from './product/product.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { ExploreSkeletonComponent } from './explore-skeleton/explore-skeleton.component';

@NgModule({
  declarations: [ProductComponent, ProductManagerComponent, ExploreSkeletonComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ProductComponent, ProductManagerComponent, ExploreSkeletonComponent]
})
export class ComponentsModule { }
