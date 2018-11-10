import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})
export class EditproductComponent implements OnInit {

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<EditproductComponent>
  ) { }

  public product;
  private editProduct;
  public loading: boolean;
  form: FormGroup;
  private formSubmitAttempt: boolean;

  private uploadImageData;

  ngOnInit() {
    this.loading = true;
    this.product = this.data.product;
    this.editProduct =  Object.assign({}, this.product);
    /** Create a new form*/
    this.form = this.fb.group({
      name: [this.editProduct.name, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32)])],
      price: [this.editProduct.price, Validators.compose([
        Validators.required])],
      barcode: [this.editProduct.barcode, Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(32)])],
      imagename: [this.editProduct.imagename],
      active: [this.editProduct.active],
      revokeable: [this.editProduct.revokeable],
      countable: [this.editProduct.countable]
    });
    this.loading = false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  /** We need this two functions to set the default value for the select
      field */
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2;
  }

  fileChanged(event) {
    if (event.target.files) {
      // Check number of files (only one allowed)
      const countFiles = event.target.files.length;
      if (countFiles > 1 || countFiles == 0) {
        this.snackbar.openSnackBar('Image is not valid', '', 'error');
        return;
      }

      const file = event.target.files[0];
      const fileName = file.name;
      const extension = fileName.substring(
        fileName.lastIndexOf('.') + 1).toLowerCase();

      // Check extension
      if (extension !== 'png') {
        this.snackbar.openSnackBar('Image must be a png file', '', 'error');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onerror = () => {
        this.snackbar.openSnackBar('Could not read image', '', 'error');
        return;
      };

      const productImageHolder = document.getElementById('productimage');

      reader.onload = () => {
        const img = new Image;
        img.src = reader.result.toString();
        if (img.height !== img.width) {
          this.snackbar.openSnackBar('The image must be quadratic', '', 'error');
          return;
        }
        this.uploadImageData = {
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        };
        productImageHolder.setAttribute('src', reader.result.toString());
      };
    } else {
      this.snackbar.openSnackBar('Image is not valid', '', 'error');
      return;
    }
  }

  submitForm() {
    // Check whether the product image has changed.
    if (typeof this.uploadImageData !== 'undefined') {
      this.dataService.upload(this.uploadImageData).subscribe(result => {
        this.form.get('imagename').setValue(result['filename']);
        this.updateProduct();
      });
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    const data = this.form.value;
    const updateData = {};
    for (const [key, value] of Object.entries(data)) {
      if (this.product.hasOwnProperty(key)) {
        if (value !== this.product[key]) {
          updateData[key] = value;
        }
      } else {
        this.snackbar.openSnackBar('Invalid form data', '', 'error');
        return;
      }
    }

    if (Object.keys(updateData).length !== 0) {
      this.dataService.updateProduct(this.product.id, updateData).subscribe(() => {
        this.closeDialog(true);
      })
    } else {
      this.snackbar.openSnackBar('Nothing has changed', '', 'info');
      this.closeDialog(false);

    }
  }

  imageURL(): string {
    return '/api/images/' + (this.product.imagename || '');
  }

  closeDialog(reload: boolean) {
    this.dialogRef.close(reload);
  }
}
