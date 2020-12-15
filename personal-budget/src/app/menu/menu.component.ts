import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { AuthGuard } from '../shared/Interceptors/auth.guard';
import { User } from '../shared/models/user';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private notiService: NotificationService,
    private route: ActivatedRoute,
    private canActivateGuard: AuthGuard
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  logout() {
    this.authenticationService.logout();
    this.notiService.showMessage('Logout Successfully');
    this.canActivateGuard.canActivate(
      this.route.snapshot,
      this.router.routerState.snapshot);
  }

}
