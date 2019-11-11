import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})
export class LayoutPage implements OnInit {
  public appPages = [
    {
      title: 'Perfil',
      url: '/layout/profile',
      icon: 'person'
    },
    {
      title: 'Explorar',
      url: '/layout/explore',
      icon: 'globe'
    },
    {
      title: 'Carrito',
      url: '/layout/cart',
      icon: 'cart'
    }
  ];

  public infoPages = [
    {
      title: 'Contactanos',
      url: '/layout/contact',
      icon: 'contacts'
    },
    {
      title: 'FAQs',
      url: '/layout/faq',
      icon: 'help-circle'
    },
    {
      title: 'Configuracion',
      url: '/layout/settings',
      icon: 'cog'
    }
  ];

  public user: User;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
     this.user = user;
    });
  }

  logout() {
    this.authService.logoutUser().then(res => {
      this.router.navigate(['login']);
    });
  }
}
