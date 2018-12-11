import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.scss']
})
export class CreateProductComponent implements OnInit {

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CreateProductComponent>
  ) { }

  public loading: boolean;
  form: FormGroup;
  private formSubmitAttempt: boolean;

  ngOnInit() {
    this.loading = true;
    /** Create a new form*/
    this.form = this.fb.group({
      name: [null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32)])],
      price: [null, Validators.compose([
        Validators.required])],
      barcode: [null, Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(32)])],
      active: [true],
      revokeable: [true],
      countable: [true]
    });
    this.loading = false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  createProduct() {
    const data = this.form.value;
    this.dataService.createProduct(data).subscribe(() => {
      this.closeDialog(true);
    });
  }

  /** We need this two functions to set the default value for the select
   field */
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2;
  }

  closeDialog(reload: boolean) {
    this.dialogRef.close(reload);
  }
}
