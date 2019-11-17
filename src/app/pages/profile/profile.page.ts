import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit, OnDestroy {
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
    },
    {
      name: 'Eliminar Cuenta',
      url: 'delete'
    }
  ];

  obs: Subscription[];
  user: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.obs.push(
      this.authService.getCurrentUser().subscribe(userDocsObs => {
        this.obs.push(
          userDocsObs.subscribe(user => {
            this.user = user;
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.obs.forEach(ob => {
      ob.unsubscribe();
    });
  }
}
