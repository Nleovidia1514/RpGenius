import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  socials = [
    { icon: 'logo-instagram', name: '@RPGeniuStore', url: '/layout/contact' },
    { icon: 'logo-twitter', name: '@RPGeniu', url: 'https://twitter.com/RpGeniu' },
    { icon: 'mail', name: 'rpgeniusupp@gmail.com', url: '/layout/contact' },
    { icon: 'call', name: '0424-6423692', url: '/layout/contact' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
