import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';



@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  token = this.authService.checkToken() === null ? false : true;
  firsttime = this.authService.getLogin() === null ? 'first time ' : '';

  constructor(
    private authService: AuthService,
   // private idTouchService: IdtouchService
    ) {
      console.log(`Check token ${this.token}`);
      if (this.token) {
      //  this.idTouchService.verifyTouchId().subscribe(this.touchIdObserver);
      }
    }

    login() {
     // this.authService.authenticateUser();
    }

    ionViewWillEnter() {
      this.token = this.authService.checkToken() === null ? false : true;
      this.firsttime = this.authService.getLogin() === null ? 'first time ' : '';
    }


  ngOnInit(): void {
  }



}
