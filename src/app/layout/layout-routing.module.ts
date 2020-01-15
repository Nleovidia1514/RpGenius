import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPage } from './layout.page';

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
            path: 'security',
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
      {
        path: 'explore',
        loadChildren: '../pages/explore/explore.module#ExplorePageModule'
      },
      {
        path: 'cart',
        loadChildren: '../pages/cart/cart.module#CartPageModule'
      },
      {
        path: 'contact',
        loadChildren: '../pages/contact/contact.module#ContactPageModule'
      },
      { path: 'faq', loadChildren: '../pages/faq/faq.module#FaqPageModule' },
      {
        path: 'settings',
        loadChildren: '../pages/settings/settings.module#SettingsPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
