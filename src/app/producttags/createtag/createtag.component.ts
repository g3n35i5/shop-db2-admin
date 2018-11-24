import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-createtag',
  templateUrl: './createtag.component.html',
  styleUrls: ['./createtag.component.scss']
})
export class CreateTagComponent implements OnInit {

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CreateTagComponent>
  ) { }

  public loading: boolean;
  form: FormGroup;
  private formSubmitAttempt: boolean;

  private uploadImageData;

  ngOnInit() {
    this.loading = true;
    /** Create a new form*/
    this.form = this.fb.group({
      name: [null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(24)])]
    });
    this.loading = false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  createTag() {
    const name = this.form.get('name').value;
    this.dataService.createTag(name).subscribe(() => {
      this.closeDialog(true);
    });
  }

  closeDialog(reload: boolean) {
    this.dialogRef.close(reload);
  }
}
