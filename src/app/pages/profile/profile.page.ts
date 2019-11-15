import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  options = [
    {
      name: 'Mis Datos',
      url: 'data'
    },
    {
      name: 'Mis Compras',
      url: 'purchases'
    },
    {
      name: 'Seguridad',
      url: 'security'
    }
  ];

  user: User = { email: '', firstName: '', isAdmin: false, lastName: '', cart: [], displayName: ''};


  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().then(user => this.user = user);
  }

}
