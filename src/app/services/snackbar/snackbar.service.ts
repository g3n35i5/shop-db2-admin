import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  /** This array contains all valid snackbar classes. */
  private classes : string[]= ['error', 'success', 'info'];

  /** Open a snackbar with the given data. */
  openSnackBar(message: string, action: string, type: string) {
    let cls = '';
    if (this.classes.includes(type)) {
      cls = type + '-snackbar';
    }

    this.snackBar.open(message, action, {
      duration: 6000,
      panelClass: [cls]
    });
  }
}
