import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LayoutPage } from './layout.page';
import { ExplorePage } from '../pages/explore/explore.page';
import { ProfilePage } from '../pages/profile/profile.page';
import { CartPage } from '../pages/cart/cart.page';
import { ContactPage } from '../pages/contact/contact.page';
import { FaqPage } from '../pages/faq/faq.page';
import { SettingsPage } from '../pages/settings/settings.page';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../pages/profile/profile.module#ProfilePageModule'
          },
          {
            path: 'data',
            loadChildren: '../pages/profile/data/data.module#DataPageModule'
          },
          {
            path: 'purchases',
            loadChildren:
              '../pages/profile/purchases/purchases.module#PurchasesPageModule'
          },
          {
            path: 'securiy',
            loadChildren:
              '../pages/profile/security/security.module#SecurityPageModule'
          }
        ]
      },
      {
        path: 'admin',
        children: [
          {
            path: '',
            loadChildren: '../pages/admin/admin.module#AdminPageModule'
          },
          {
            path: 'product/modify/:productId',
            loadChildren:
              '../pages/admin/modify-product/modify-product.module#ModifyProductPageModule'
          }
        ]
      },
      { path: 'explore', component: ExplorePage },
      { path: 'cart', component: CartPage },
      { path: 'contact', component: ContactPage },
      { path: 'faq', component: FaqPage },
      { path: 'settings', component: SettingsPage }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [
    LayoutPage,
    ExplorePage,
    CartPage,
    ContactPage,
    FaqPage,
    SettingsPage
  ]
})
export class LayoutPageModule {}
