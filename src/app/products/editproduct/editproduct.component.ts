import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  private tagMap = new Map();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  ngOnInit() {
    this.loading = true;
    this.product = this.data;
    this.dataService.getProducttags().subscribe(res => {
      const tags = <any[]>res;
      for (const tag of tags) {
        if (this.product.tags.includes(tag['id'])) {
          this.tags.push(tag['name']);
        }
        this.tagMap.set(tag['id'], tag['name']);
        this.allTags.push(tag['name']);
      }
    });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
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
      revocable: [this.editProduct.revocable],
      countable: [this.editProduct.countable]
    });
    this.loading = false;
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        const name = value.trim();
        if (this.tags.indexOf(name) === -1) {
          this.tags.push(name);
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  remove(tag: string): void {
    // Get the ID of the removed tag
    let tagID = null;

    for (const entry of Array.from(this.tagMap.entries())) {
      const id = entry[0];
      const name = entry[1];
      if (name === tag) {
        tagID = id;
        break;
      }
    }
    if (tagID !== null) {
      this.dataService.removeTagAssignment(this.product.id, tagID).subscribe(() => {
        const index = this.allTags.indexOf(tag);
        if (index >= 0) {
          this.tags.splice(index, 1);
        }
        }
      );
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tagName = event.option.viewValue;

    let tagID = null;

    for (const entry of Array.from(this.tagMap.entries())) {
      const id = entry[0];
      const name = entry[1];
      if (name === tagName) {
        tagID = id;
        break;
      }
    }

    if (tagID !== null) {
      this.tags.push(tagName);
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
      this.dataService.addTagAssignment(this.product.id, tagID).subscribe();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }



  compareByValue(f1: any, f2: any) {
    return f1 && f2;
  }

  /** We need this two functions to set the default value for the select
   field */
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  fileChanged(event) {
    if (event.target.files) {
      // Check number of files (only one allowed)
      const countFiles = event.target.files.length;
      if (countFiles > 1 || countFiles == 0) {
        this.snackbar.openSnackBar('Image is not valid');
        return;
      }

      const file = event.target.files[0];
      const fileName = file.name;
      const extension = fileName.substring(
        fileName.lastIndexOf('.') + 1).toLowerCase();

      // Check extension
      if (extension !== 'png') {
        this.snackbar.openSnackBar('Image must be a png file');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onerror = () => {
        this.snackbar.openSnackBar('Could not read image');
        return;
      };

      const productImageHolder = document.getElementById('productimage');

      reader.onload = () => {
        const img = new Image;
        img.src = reader.result.toString();
        if (img.height !== img.width) {
          this.snackbar.openSnackBar('The image must be quadratic');
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
      this.snackbar.openSnackBar('Image is not valid');
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
        this.snackbar.openSnackBar('Invalid form data');
        return;
      }
    }

    if (Object.keys(updateData).length !== 0) {
      this.dataService.updateProduct(this.product.id, updateData).subscribe(() => {
        this.closeDialog(true);
      });
    } else {
      this.snackbar.openSnackBar('Nothing has changed');
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
