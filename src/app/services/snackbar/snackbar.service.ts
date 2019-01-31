import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  /** Open a snackbar with the given data. */
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 6000,
    });
  }
}
