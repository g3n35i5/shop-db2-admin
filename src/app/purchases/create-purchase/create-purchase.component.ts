import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Product } from '../../interfaces/product';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.scss']
})

export class CreatePurchaseComponent implements OnInit {

  public loading: boolean;
  userControl = new FormControl();
  productControl = new FormControl();
  form: FormGroup;
  private formSubmitAttempt: boolean;
  public users: User[];
  public products: Product[];
  public purchase: any = {};
  public filteredUsers: Observable<User[]>;
  public filteredProducts: Observable<Product[]>;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<CreatePurchaseComponent>) {}

  /** Set loading to true and create the form and load all users. */
  ngOnInit() {
    this.loading = true;
    this.createForm();
    this.loadData();
  }

  /** Load all users from the backend. Convert them to a simplified user
   object containing only the id and the name.*/
  loadData() {
    const users = this.dataService.getUsers();
    const products = this.dataService.getProducts();
    forkJoin([users, products]).subscribe(result => {
      this.users = this.convertUsers(result[0]);
      this.products = <any[]>result[1];
      this.processingData();
    });
  }

  /** Creates the deposit form. */
  createForm() {
    this.form = this.fb.group({
      amount: [null, Validators.required],
      user_id: [null, Validators.required],
      product_id: [null, Validators.required]
    });
  }

  /** Checks all form fields for their validity. */
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  /** Convert the users to the simplified user object and set loading
   to false. */
  processingData() {
    this.filteredUsers = this.userControl.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterUsers(name) : this.users.slice())
      );
    this.filteredProducts = this.productControl.valueChanges
      .pipe(
        startWith<string | Product>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterProducts(name) : this.products.slice())
      );
    this.loading = false;
  }

  /** Helper function which converts the users. */
  convertUsers(users): User[] {
    return users.map(user => ({
      id: user.id,
      name: user.lastname + ', ' + user.firstname
    }));
  }

  /** This function gets called each time a new user gets selected in
   the mat-autocomplete dropdown field. */
  userChanged(event) {
    const user = event.option.value;
    if (user !== undefined && user !== null) {
      this.form.controls['user_id'].setValue(user.id);
    } else {
      this.form.controls['user_id'].setValue(null);
    }
  }

  /** This function gets called each time a new product gets selected in
   the mat-autocomplete dropdown field. */
  productChanged(event) {
    const product = event.option.value;
    if (product !== undefined && product !== null) {
      this.form.controls['product_id'].setValue(product.id);
    } else {
      this.form.controls['product_id'].setValue(null);
    }
  }

  /** Deletes the user field from the form. */
  resetUser() {
    this.form.controls['user_id'].setValue(null);
    this.userControl.setValue('');
  }

  /** Deletes the product field from the form. */
  resetProduct() {
    this.form.controls['product_id'].setValue(null);
    this.productControl.setValue('');
  }

  /** Returns the username for the dropdown menu. */
  displayFnUser(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  /** Returns the username for the dropdown menu. */
  displayFnProduct(product?: Product): string | undefined {
    return product ? product.name : undefined;
  }

  /** This function filters users according to the search term entered. */
  private _filterUsers(name: string): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) > -1
    );
  }

  /** This function filters users according to the search term entered. */
  private _filterProducts(name: string): Product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().indexOf(name.toLowerCase()) > -1
    );
  }

  /** Submits the deposit form. */
  submitForm() {
    if (this.form.valid) {
      this.dataService.createPurchase(this.form.value).subscribe(() => {
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
