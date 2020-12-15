import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms'
import { DataService } from '../data.service';
import { BudgetService } from '../shared/budget.service';
import { NotificationService } from '../shared/notification.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  view: any[] = [400, 300];
  colorScheme = {
    domain: ['#a8385d', '#aae3f5', '#adcded', '#7aa3e5','#a27ea8','#a95963','#8796c0']
  };
  budgetChartData = [];
  expenseChartData = [];
  budgetExpenseChartData = [];

  newCategoryControl: FormControl;
  budgetCategoryControl: FormControl;
  budgetValueControl: FormControl;
  budgetMonthControl: FormControl;
  expenseCategoryControl: FormControl;
  expenseValueControl: FormControl;
  expenseMonthControl: FormControl;
  chartMonth: FormControl;
  loading = false;

  categories = [];
  categoryMap = new Map();
  budget = [];
  expense = [];

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonth = this.months[(new Date()).getMonth()];

  constructor(private http: HttpClient, private dataService: DataService, private budgetService: BudgetService, private notiService: NotificationService) {
    this.newCategoryControl = new FormControl('', [Validators.required]);
    this.budgetCategoryControl = new FormControl('', [Validators.required]);
    this.budgetValueControl = new FormControl('', [Validators.required, Validators.min(0)]);
    this.budgetMonthControl = new FormControl(this.currentMonth, [Validators.required]);
    this.expenseCategoryControl = new FormControl('', [Validators.required]);
    this.expenseValueControl = new FormControl('', [Validators.required, Validators.min(0)]);
    this.expenseMonthControl = new FormControl(this.currentMonth, [Validators.required]);
    this.chartMonth = new FormControl(this.currentMonth, [Validators.required]);
  }

  ngOnInit(): void {

    this.fetchCategories();
    this.fetchBudget();
    this.fetchExpense();
    this.chartMonth.valueChanges.subscribe(_ => {
      setTimeout(_ => {
        this.prepareBudgetData();
        this.prepareExpenseData();
      }, 0);
    })
  }

  fetchCategories() {
    this.loading = true;
    this.budgetService.getCategories().subscribe(x => {
      this.categories = x;
      this.categoryMap = new Map();
      this.categories.forEach(x => {
        this.categoryMap.set(x.Id, x.Category);
      })
      this.loading = false;
      this.prepareBudgetData();
      this.prepareExpenseData();
    });
  }

  fetchBudget() {
    this.budgetService.getBudget().subscribe(x => {
      this.budget = x;
      this.prepareBudgetData();
    });
  }

  fetchExpense() {
    this.budgetService.getExpense().subscribe(x => {
      console.log(x);
      this.expense = x;
      this.prepareExpenseData();
    });
  }

  insertCategories() {
    this.loading = true;
    this.newCategoryControl.markAllAsTouched();
    let newCategory = this.newCategoryControl.value;
    if (!this.newCategoryControl.valid) {
      this.notiService.showErrorMessage('Please check Validation');
      this.loading = false;
      return;
    }
    const isExisting = this.categories.some(el => el.Category.toUpperCase() == newCategory.toUpperCase());
    if (isExisting) {
      this.notiService.showErrorMessage('Category Already Exists! Please try with a new Category');
      this.loading = false;
      return;
    }
    this.budgetService.insertCategories(newCategory).subscribe(x => {
      this.newCategoryControl.reset();
      this.newCategoryControl.markAsUntouched();
      this.loading = false;
      this.fetchCategories();
      this.notiService.showSuccessMessage('Category Added Successfully');
    });
  }

  addBudget() {
    this.markAsTouched([this.budgetCategoryControl, this.budgetValueControl, this.budgetMonthControl]);
    if (!this.budgetCategoryControl.valid || !this.budgetValueControl.valid || !this.budgetMonthControl.valid) {
      this.notiService.showErrorMessage('Please check Validation');
      return;
    }
    if (this.budgetValueControl.value == 0) {
      this.notiService.showErrorMessage('Value should be greater then zero.');
      return;
    }
    this.loading = true;
    this.budgetService.insertBudget(this.budgetCategoryControl.value, this.budgetValueControl.value, this.budgetMonthControl.value).subscribe(x => {
      this.reset([this.budgetCategoryControl, this.budgetValueControl]);
      this.markAsUnTouched([this.budgetCategoryControl, this.budgetValueControl, this.budgetMonthControl]);
      this.budgetMonthControl.setValue(this.currentMonth);
      this.loading = false;
      this.fetchBudget();
      this.notiService.showSuccessMessage('Budget Added Successfully');
    });
  }

  addExpense() {
    this.markAsTouched([this.expenseCategoryControl, this.expenseValueControl, this.expenseMonthControl]);
    if (!this.expenseCategoryControl.valid || !this.expenseValueControl.valid || !this.expenseMonthControl.valid) {
      this.notiService.showErrorMessage('Please check Validation');
      return;
    }
    if (this.expenseValueControl.value == 0) {
      this.notiService.showErrorMessage('Value should be greater then zero.');
      return;
    }
    this.loading = true;
    this.budgetService.insertExpense(this.expenseCategoryControl.value, this.expenseValueControl.value, this.expenseMonthControl.value).subscribe(x => {
      this.reset([this.expenseCategoryControl, this.expenseValueControl]);
      this.markAsUnTouched([this.expenseCategoryControl, this.expenseValueControl, this.expenseMonthControl]);
      this.loading = false;
      this.fetchExpense();
      this.notiService.showSuccessMessage('Expense Added Successfully');
    });
  }

  markAsTouched(formControls: FormControl[]) {
    formControls.forEach(x => {
      x.markAllAsTouched();
    });
  }

  markAsUnTouched(formControls: FormControl[]) {
    formControls.forEach(x => {
      x.markAsUntouched();
    });
  }

  reset(formControls: FormControl[]) {
    formControls.forEach(x => {
      x.reset();
    });
  }

  private prepareBudgetData() {
    const month = this.chartMonth.value;
    let budgetChartData = new Map();
    let categories = this.categoryMap;
    if(this.categories && this.budget && this.categories.length > 0 && this.budget.length > 0) {
      this.budget.forEach((x) =>{
        if(x.Month === month) {
          if(budgetChartData.has(x.CategoryId)) {
            let v = parseFloat(budgetChartData.get(x.CategoryId).value) + parseFloat(x.Budget);
            budgetChartData.set(x.CategoryId, {name: categories.get(x.CategoryId), value: v});
          } else {
            budgetChartData.set(x.CategoryId, {name: categories.get(x.CategoryId), value: x.Budget});
          }
        }
      });
    }
    this.budgetChartData = Array.from(budgetChartData.values());
    this.prepareBudgetExpenseData();
  }

  private prepareExpenseData() {
    const month = this.chartMonth.value;
    let expenseChartData = new Map();
    let categories = this.categoryMap;
    if(this.categories && this.expense && this.categories.length > 0 && this.expense.length > 0) {
      this.expense.forEach((x) =>{
        if(x.Month === month) {
          if(expenseChartData.has(x.CategoryId)) {
            let v = parseFloat(expenseChartData.get(x.CategoryId).value) + parseFloat(x.Expense);
            expenseChartData.set(x.CategoryId, {name: categories.get(x.CategoryId), value: v});
          } else {
            expenseChartData.set(x.CategoryId, {name: categories.get(x.CategoryId), value: x.Expense});
          }
        }
      });
    }
    this.expenseChartData = Array.from(expenseChartData.values());
    this.prepareBudgetExpenseData();
  }

  private prepareBudgetExpenseData() {
    let categories = new Map();
    if(this.categories && this.expenseChartData && this.categories.length > 0 && this.expenseChartData.length > 0) {
      this.expenseChartData.forEach(x => {
        categories.set(x.name, {name: x.name, series: [{name: 'Expense', value: x.value }]})
      });
    }
    if(this.categories && this.budgetChartData && this.categories.length > 0 && this.budgetChartData.length > 0) {
      this.budgetChartData.forEach(x => {
        if(categories.get(x.name)) {
          let series = categories.get(x.name).series;
          series.push({name: 'Budget', value: x.value});
        } else {
          categories.set(x.name, {name: x.name, series: [{name: 'Budget', value: x.value }]});
        }
      });
    }
    this.budgetExpenseChartData= Array.from(categories.values());
  }
  
}






