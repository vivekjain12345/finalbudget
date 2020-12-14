import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap, map, retryWhen, delay, catchError } from 'rxjs/operators';
//import { HttpService } from '../../../services/http.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  serverURL = 'http://localhost:3000/';

  constructor(private http: HttpClient, private authenticationService: AuthService) {

  }

  public getCategories(): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    console.log(currentUser);
    const userId = currentUser['Id'];
    return this.http.get<any>(`${this.serverURL}fetchCategories?userId=${userId}`);
  }

  public insertCategories(category: string): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.post<any>(`${this.serverURL}addCategory`, { userId: userId, category: category })
  }
}

