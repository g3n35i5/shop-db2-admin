import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-edittag',
  templateUrl: './edittag.component.html',
  styleUrls: ['./edittag.component.scss']
})

export class EditTagComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  public loading: boolean;
  private tag;
  private editTag;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditTagComponent>) {}

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  /** Fetch the user from the backend. */
  ngOnInit() {
    this.loading = true;
    this.tag = this.data.tag;
    this.editTag =  Object.assign({}, this.tag);
    /** Create a new form*/
    this.form = this.fb.group({
      name: [this.editTag.name, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(24)])
      ]
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
        if (this.tag[item] !== value) {
          data[item] = value;
        }
      }
    }
    /** Only submit the form if it is valid. */
    if (this.form.valid) {
      this.dataService.updateProducttag(this.tag.id, data).subscribe(() => {
        this.closeDialog(true);
      });
    } else {
      this.snackbar.openSnackBar('The form is invalid.', '', 'error');
    }
  }

  processingData() {
    this.loading = false;
  }

  /** Close the dialog. */
  closeDialog(reload: boolean = false) {
    this.dialogRef.close(reload);
  }
}
