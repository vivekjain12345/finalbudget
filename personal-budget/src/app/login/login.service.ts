import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap, map, retryWhen, delay, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  serverURL = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post(`${this.serverURL}register`, user);
  }
}
