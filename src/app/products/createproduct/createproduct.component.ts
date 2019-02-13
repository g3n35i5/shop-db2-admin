import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent
} from '@angular/material';
import { DataService } from '../../services/data/data.service';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import {forkJoin, Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import {log} from 'util';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.scss']
})
export class CreateProductComponent implements OnInit {


  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags;
  selectedTags: string[] = [];
  allTags: string[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CreateProductComponent>
  ) {
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
      tags: [[], Validators.compose([
        Validators.required])],
      active: [true],
      revocable: [true],
      countable: [true]
    });
  }

  public loading: boolean;
  form: FormGroup;
  private formSubmitAttempt: boolean;

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  loadData(): void {
    const tags = this.dataService.getProducttags();
    forkJoin([tags]).subscribe(results => {
      this.tags = results[0]['tags'];
      this.processingData();
    });
  }

  processingData(): void {
    if (this.tags.length === 0) {
      this.snackbar.openSnackBar('Create tags before creating a product');
      this.closeDialog(false);
    }

    for (const tag of this.tags) {
      this.allTags.push(tag['name']);
    }

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
    this.loading = false;
  }

  remove(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.form.controls['tags'].value.splice(index, 1);
    }
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

  selected(event: MatAutocompleteSelectedEvent): void {
    const tagName = event.option.viewValue;

    let tagID = null;

    for (const tag of this.tags) {
      if (tag['name'] === tagName) {
        tagID = tag['id'];
        break;
      }
    }

    if (tagID !== null) {
      this.selectedTags.push(tagName);
      this.form.controls['tags'].value.push(tagID);
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
    }
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
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
