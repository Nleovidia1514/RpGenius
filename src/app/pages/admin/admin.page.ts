import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  @ViewChild(IonSlides, { static: false}) slides: IonSlides;
  activeSlide = 0;

  options = [
    { name: 'Products', icon: 'gift', index: 1 }
  ];

  constructor() { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
   await this.slides.lockSwipes(true);
  }

  async moveTo(slideIndex: number) {
    await this.slides.lockSwipes(false);
    await this.slides.slideTo(slideIndex);
    this.activeSlide = slideIndex;
    await this.slides.lockSwipes(true);
  }

  async goBack() {
    const prevIndex = await this.slides.getPreviousIndex();
    this.moveTo(prevIndex);
  }

}
