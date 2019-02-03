import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-payoff',
  templateUrl: './create-payoff.component.html',
  styleUrls: ['./create-payoff.component.scss']
})

export class CreatePayoffComponent implements OnInit {

  public loading: boolean;
  form: FormGroup;
  public minCommentLength = 4;
  public maxCommentLength = 64;
  private formSubmitAttempt: boolean;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<CreatePayoffComponent>) {}

  /** Set loading to true and create the form and load all users. */
  ngOnInit() {
    this.loading = true;
    this.createForm();
    this.loadData();
  }

  /** Load all users from the backend. Convert them to a simplified user
   object containing only the id and the name.*/
  loadData() {
    this.processingData();
  }

  /** Creates the payoff form. */
  createForm() {
    this.form = this.fb.group({
      amount: [null, Validators.required],
      comment: [null, Validators.compose([
        Validators.required,
        Validators.minLength(this.minCommentLength),
        Validators.maxLength(this.maxCommentLength)])
      ]
    });
  }

  /** Checks all form fields for their validity. */
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  processingData() {
    this.loading = false;
  }

  /** Indicates whether the length of the comment is within the
   permitted range. */
  commentLengthHint() {
    const value = this.form.get('comment').value;
    if (value === null) {
      return '0 / ' + this.maxCommentLength.toString();
    }
    return value.length.toString() + ' / ' + this.maxCommentLength.toString();
  }

  /** Submits the payoff form. */
  submitForm() {
    if (this.form.valid) {
      this.dataService.createPayoff(this.form.value).subscribe(() => {
        this.closeDialog();
      });
    } else {
      this.snackbar.openSnackBar('The form is invalid.');
    }
  }

  /** Close the dialog. */
  closeDialog() {
    this.dialogRef.close();
  }
}
