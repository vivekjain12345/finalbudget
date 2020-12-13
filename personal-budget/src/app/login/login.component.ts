import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginService } from './login.service';
import { first } from 'rxjs/operators';
import { NotificationService } from '../shared/notification.service';



@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  sigunUpForm: FormGroup;
  submitted = false;
  loginSubmitted = false;
  loading = false;
  loginLoading = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private notificationService: NotificationService
    // private idTouchService: IdtouchService
  ) {
    this.sigunUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', Validators.required]
    });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.sigunUpForm.controls; }
  get fl() { return this.loginForm.controls; }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.notificationService.showMessage("Logged In Already! Redirected to dashboard page.");
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.loginSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginLoading = true;
    this.authService.login(this.fl.email.value, this.fl.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data && data['success']) {
            this.showAlertMessage(false, 'Login Successfull! Redirected to dashboard');
            this.router.navigate(['/dashboard']);
            this.loginLoading = false;
          } else {
            this.showAlertMessage(true, 'Combination of username and password do not match');
            this.loginLoading = false;
          }
        },
        error => {
          this.showAlertMessage(true, 'Some Error Occured! Please try again later.');
          this.loginSubmitted = false;
          this.loginLoading = false;
        });
    // this.authService.authenticateUser();
  }

  addUser() {
    this.submitted = true;
    if (this.sigunUpForm.invalid) {
      return;
    }
    this.loading = true;

    this.loginService.register(this.sigunUpForm.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data && data['success']) {
            this.showAlertMessage(false, 'User Created Successfully');
            this.sigunUpForm.reset();
          } else {
            this.showAlertMessage(true, 'Email Id Already Exists! Please try a new one.')
          }
          this.submitted = false;
          this.loading = false;
        },
        error => {
          this.showAlertMessage(true, 'Some Error Occured! Please try again later.');
          this.submitted = false;
          this.loading = false;
        }
      )
  }

  showAlertMessage(isError: boolean, msg: string) {
    if (isError) {
      this.notificationService.showErrorMessage(msg);
    } else {
      this.notificationService.showSuccessMessage(msg);
    }
  }
}
