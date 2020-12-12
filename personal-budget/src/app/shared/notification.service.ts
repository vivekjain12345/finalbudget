import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    duration: 5000,
    panelClass: ['mat-elevation-z3']
  };

  constructor(private snackbar: MatSnackBar) { }

  showMessage(msg: string, config?: MatSnackBarConfig): void {
    config = __assign(this.defaultConfig, config);
    this.snackbar.open(msg, '', config);
  }

  showSuccessMessage(msg: string, config?: MatSnackBarConfig): void {
    console.log(this.defaultConfig);
    config = __assign(JSON.parse(JSON.stringify(this.defaultConfig)), config);
    config.panelClass = [...config.panelClass, 'success'];
    this.snackbar.open(msg, '', config);
  }

  showErrorMessage(msg: string, config?: MatSnackBarConfig): void {
    console.log(this.defaultConfig);
    console.log(config);
    config = __assign(JSON.parse(JSON.stringify(this.defaultConfig)), config);
    config.panelClass = [...config.panelClass, 'error'];
    this.snackbar.open(msg, '', config);
  }


}