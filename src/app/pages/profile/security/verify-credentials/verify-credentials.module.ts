import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerifyCredentialsPage } from './verify-credentials.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyCredentialsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerifyCredentialsPage]
})
export class VerifyCredentialsPageModule {}
