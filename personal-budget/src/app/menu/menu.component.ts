import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  currentUser: User;

  constructor(private authenticationService: AuthService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
  }

}
