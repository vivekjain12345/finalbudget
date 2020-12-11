import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginService } from './login.service';
import { first } from 'rxjs/operators';



@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  token = this.authService.checkToken() === null ? false : true;
  firsttime = this.authService.getLogin() === null ? 'first time ' : '';
  submitted = false;
  sigunUpForm;
  alertMsg = '';
  showErrorAlert = false;
  showSuccessAlert = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
    // private idTouchService: IdtouchService
  ) {
    this.sigunUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', Validators.required]
    });
    console.log(`Check token ${this.token}`);
    if (this.token) {
      //  this.idTouchService.verifyTouchId().subscribe(this.touchIdObserver);
    }
  }

  get f() { return this.sigunUpForm.controls; }

  login() {
    // this.authService.authenticateUser();
  }

  ionViewWillEnter() {
    this.token = this.authService.checkToken() === null ? false : true;
    this.firsttime = this.authService.getLogin() === null ? 'first time ' : '';
  }


  ngOnInit(): void {
  }

  addUser() {
    this.submitted = true;
    
    if (this.sigunUpForm.invalid) {
      return;
    }
    this.loginService.register(this.sigunUpForm.value)
    .pipe(first())
    .subscribe(
      data => {
        console.log(data);
        if(data && data['success']) {
          this.showAlertMessage(false, 'User Created Successfully');
          this.sigunUpForm.reset();
          this.submitted = false;
        } else {
          this.showAlertMessage(true, 'Email Id Already Exists! Please try a new one.')
        }
      },
      error => {
        this.showAlertMessage(true, 'Some Error Occured! Please try again later.')
      }
    )
  }

  showAlertMessage(isError: boolean, msg: string) {
    this.alertMsg = msg;
    if(isError) {
      this.showErrorAlert = true;
    } else {
      this.showSuccessAlert = true;
    }
    setTimeout(_ => {
      this.showErrorAlert = false;
      this.showSuccessAlert = false;
    }, 5000);
  }


}
