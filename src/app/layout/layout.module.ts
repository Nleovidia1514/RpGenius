import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
      { path: 'profile', component: ProfilePage },
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
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [
    LayoutPage,
    ExplorePage,
    ProfilePage,
    CartPage,
    ContactPage,
    FaqPage,
    SettingsPage
  ]
})
export class LayoutPageModule {}
