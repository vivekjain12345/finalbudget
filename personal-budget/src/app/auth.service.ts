import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap, map, retryWhen, delay, catchError } from 'rxjs/operators';
//import { HttpService } from '../../../services/http.service';
import { HttpClient  } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private requestJWTToken(authCode: string): Observable<any> {
  //   console.log(`requestJWTToken running...`);
  //   console.log(`AuthCode: `, authCode);
  //   const url = 'http://localthost:3000';
  //   const body = {
  //     code: authCode,
  //     grant_type: 'authorization_code',
  //    // client_id: environment.clientId,
  //     //redirect_uri: environment.redirectUri
  //   };
  //   const headers = {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Accept: 'application/x-www-form-urlencoded',
  //   };
  //   console.log(`URL: `, url, `Body: `, body, `Headers: `, headers);
  //  // return this.httpService.httpPost(url, body, headers);
  // }

  /**
   *
   * @param backendIdToken
   */
  // private requestNewIdToken(backendIdToken: string): Observable<any> {
  //   //const url = environment.idTokenEndpoint;
  //   const body = {
  //     abbvieIdToken: backendIdToken
  //   };
  //  // return this.httpService.httpGet(url, body);
  //   }

  /**
   * Retrieve the saved ID Token that must be passed as a bearer token when making API calls
   */
  //  getToken(): Observable<string> {
  //    console.log('getToken');
  //    // localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNTA0NzYwNCIsInN1YiI6IjE1MDQ3NjA0IiwibmJmIjoxNTg4NjAzNjM3LCJleHAiOjE2MjAxMzk2MzcsImlhdCI6MTU4ODYwMzYzN30.bgOkSfAW5k4kOZ9BLm3_JmhokvHHeZ2CTJfIMRXebec');
  //    return of(localStorage.getItem('token'));
  //  }

  /**
   * Save the ID Token
   * @param token
   */
  saveToken(token: string) {
    return localStorage.setItem('token', token);
  }

  deleteToken() {
    return localStorage.removeItem('token');
  }

  /**
   * TODO - Check token to see if true
   * @param token
   */
  checkToken() {
    return localStorage.getItem('token');
  }

  authenticateIfToken() {
    if (localStorage.getItem('token')) {
      //return this.authenticatedState.next(true);
    }
  }

  logout() {
   this.deleteToken();
  // this.callbackState.next(false);
   //this.authenticatedState.next(false);
 }

 saveLogin() {
    return localStorage.setItem('firsttime', 'true');
  }

  getLogin() {
    return localStorage.getItem('firsttime');
  }
}
