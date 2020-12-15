import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { HttpService } from '../../../services/http.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { serverURL } from './models/constants';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient, private authenticationService: AuthService) {

  }

  public getCategories(): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.get<any>(`${serverURL}fetchCategories?userId=${userId}`);
  }

  public getBudget(): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.get<any>(`${serverURL}fetchBudget?userId=${userId}`);
  }

  public getExpense(): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.get<any>(`${serverURL}fetchExpense?userId=${userId}`);
  }

  public insertCategories(category: string): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.post<any>(`${serverURL}addCategory`, { userId: userId, category: category })
  }

  public insertBudget(categoryId: number, budgetValue: number, month: string): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.post<any>(`${serverURL}addBudget`, { categoryId, budgetValue, month, userId })
  }

  public insertExpense(categoryId: number, expenseValue: number, month: string): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    const userId = currentUser['Id'];
    return this.http.post<any>(`${serverURL}addExpense`, { categoryId, expenseValue, month, userId })
  }
}

