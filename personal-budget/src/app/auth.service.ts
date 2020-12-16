import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap, map, retryWhen, delay, catchError } from 'rxjs/operators';
//import { HttpService } from '../../../services/http.service';
import { HttpClient } from '@angular/common/http';
import { User } from './shared/models/user';
import { NotificationService } from './shared/notification.service';
import { serverURL } from './shared/models/constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  timer;
  timerInterval;

  constructor(private http: HttpClient, private notiService: NotificationService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    this.clearTimer();
    return this.http.post<any>(`${serverURL}login`, { username, password })
      .pipe(map(res => {
        // login successful if there's a jwt token in the response
        if (res.response && res.response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res.response));
          this.currentUserSubject.next(res.response);
          this.timer = setTimeout(_ => {
            this.notiService.showMessage("Session will expire in next 100 seconds");
            this.timerInterval = setTimeout(_ => {
              this.notiService.showMessage("Session expired. Please login again.");
              this.logout();
            }, 100000);
          }, 50000);
        }

        return res;
      }));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.notiService.showMessage('Logout Successfully');
    this.clearTimer();
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
