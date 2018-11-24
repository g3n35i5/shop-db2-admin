import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  public loading: boolean;
  private user;
  private editUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditUserComponent>) {}

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  /** Fetch the user from the backend. */
  ngOnInit() {
    this.loading = true;
    this.user = this.data.user;
    delete this.user.credit;
    this.editUser =  Object.assign({}, this.user);
    /** Create a new form*/
    this.form = this.fb.group({
      firstname: [this.editUser.firstname, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32)])
      ],
      lastname: [this.editUser.lastname, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32)])
      ],
      password: [null],
      password_repeat: [null],
      is_admin: [this.editUser.is_admin]
    });
    this.processingData();
  }

  submitForm() {
    this.formSubmitAttempt = true;
    const data = {};
    /** Add only the data that is different from the original user
        and not null. */
    for (const item of Object.keys(this.form.value)) {
      const value = this.form.value[item];
      if (!(typeof value === 'undefined' || value === null || value === '')) {
        if (this.user[item] !== value) {
          data[item] = value;
        }
      }
    }
    /** Only submit the form if it is valid. */
    if (this.form.valid) {
      this.dataService.updateUser(this.user.id, data).subscribe(() => {
        this.closeDialog();
      });
    } else {
      this.snackbar.openSnackBar('The form is invalid.', '', 'error');
    }
  }

  processingData() {
    this.loading = false;
  }

  /** We need this two functions to set the default value for the select
      field */
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2;
  }

  /** Close the dialog. */
  closeDialog() {
    this.dialogRef.close();
  }
}
