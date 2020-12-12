import { Injectable, Component } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Mybudget } from './shared/models/budget';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  private mybudget: Mybudget;
  constructor(private http:HttpClient) { }

  get BudgetData() {
    return this.mybudget;
  }

  set BudgetData(mybudgetData) {
    this.mybudget = mybudgetData;
  }


public getData(): Observable<any> {
  return this.http.get<any>('http://localhost:3000/budget')  ;
}








}


