import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductComponent } from './product/product.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';

@NgModule({
  declarations: [ProductComponent, ProductManagerComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ProductComponent, ProductManagerComponent]
})
export class ComponentsModule { }
