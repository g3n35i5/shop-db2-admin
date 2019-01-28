import {Component, OnInit, Inject} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import {DataService} from '../../services/data/data.service';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {Product} from '../../interfaces/product';
import {Replenishment} from '../../interfaces/replenishment';

@Component({
  selector: 'app-createreplenishment',
  templateUrl: './createreplenishment.component.html',
  styleUrls: ['./createreplenishment.component.scss']
})

export class CreateReplenishmentComponent implements OnInit {

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CreateReplenishmentComponent>
  ) {
    dialogRef.disableClose = true;
  }

  public loading: boolean;
  public products: Product[];
  public replenishmentList: Replenishment[] = [];

  public minCommentLength = 4;
  public maxCommentLength = 64;

  private closeAttempt = false;

  commentCtrl = new FormControl(
    '',
    [
      Validators.required,
      Validators.minLength(this.minCommentLength),
      Validators.maxLength(this.maxCommentLength)
    ]
  );
  productCtrl = new FormControl();
  amountCtrl = new FormControl(null, [Validators.required, Validators.min(0)]);
  totalPriceCtrl = new FormControl(null, [Validators.required, Validators.min(0)]);
  filteredProducts: Observable<Product[]>;


  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  loadData() {
    const products = this.dataService.getProducts();
    forkJoin([products]).subscribe(result => {
      this.products = result[0]['products'];
      this.processingData();
    });
  }

  processingData() {
    this.filteredProducts = this.productCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.products.slice())
      );
    this.loading = false;
  }

  imagePath(replenishment: Replenishment): string {
    const product: Product = this.getProductByID(replenishment.product_id);
    const path = '/api/images/';
    return product.imagename !== null ? path + product.imagename : path;
  }

  /**
   * This method is called on pressing the submit button. It creates a
   * replenishmentcollection from all replenishment and sends it to the API.
   */
  submit(): void {
    // If the comment is invalid, display an error message.
    if (!(this.commentCtrl.valid)) {
      this.snackbar.openSnackBar('Invalid comment', '', 'error');
      return;
    }

    // If there are no replenishments yet, display an error message.
    if (this.replenishmentList.length <= 0) {
      this.snackbar.openSnackBar('Please enter at least one item', '', 'error');
      return;
    }

    // Create the replenishmentcollection object.
    const data = {
      replenishments: this.replenishmentList,
      comment: this.commentCtrl.value
    };

    // Send it to the API and close the dialog on success.
    this.dataService.createReplenishmentCollection(data).subscribe(() => {
      this.closeDialog(true);
    });
  }

  /**
   * This method adds a replenishment to the replenishmentList.
   */
  addProduct() {
    // Only create a replenishment if all forms are valid.
    if (!(this.productCtrl.valid && this.amountCtrl.valid && this.totalPriceCtrl.valid)) {
      this.snackbar.openSnackBar('One or more values are missing', '', 'error');
      return;
    }

    // Get the name of the product.
    const productName = this.productCtrl.value;
    // Get the product.
    const product = this.products.find(p => p.name === productName);
    // Get the amount of the replenishment.
    const amount = this.amountCtrl.value;
    // Get the total price of the replenishment.
    const total_price = this.totalPriceCtrl.value;

    // Create a replenishment object.
    const replenishment: Replenishment = {
      product_id: product.id,
      amount: amount,
      total_price: total_price
    };

    // If this product already exists in the replenishmentList, display a
    // notification.
    for (const r of this.replenishmentList) {
      if (r.product_id === product.id) {
        this.snackbar.openSnackBar('Product already exists', '', 'error');
        return;
      }
    }

    // Add the replenishment to the replenishmentList.
    this.replenishmentList.push(replenishment);

    // Reset all forms.
    this.productCtrl.reset();
    this.amountCtrl.reset();
    this.totalPriceCtrl.reset();
  }

  /**
   * This method calculates the sum of all prices of all replenishments.
   */
  getReplenishmentsPrice(): number {
    let sum = 0;
    for (const replenishment of this.replenishmentList) {
      sum += replenishment.total_price;
    }
    return sum;
  }

  /**
   * This method resets the product search form.
   */
  resetForm() {
    this.productCtrl.reset();
  }

  /**
   * This method deletes a replenishment from the replenishment list.
   *
   * @param replenishment is the replenishment to be deleted.
   */
  deleteReplenishment(replenishment: Replenishment): void {
    const index = this.replenishmentList.indexOf(replenishment);
    if (index > -1) {
      this.replenishmentList.splice(index, 1);
    }
  }

  /**
   * This function gets called when the user presses the 'cancel' button.
   * If there is no data at all (empty replenishment list and no comment),
   * the dialog can be closed without any data loss.
   * Otherwise, the dialog should only be able to be closed after the user has
   * confirmed that he really wants to. For this there is the internal variable
   * 'closeAttempt'. Only if the user presses close twice, the dialog should
   * be closed.
   */
  close(): void {
    if (this.replenishmentList.length === 0 && this.commentCtrl.untouched) {
      this.closeDialog(false);
    }
    if (this.closeAttempt) {
      this.closeDialog(false);
      return;
    }
    this.closeAttempt = true;
  }

  /**
   * This method closes the dialog. When the parameter 'reload' is true, the
   * replenishment list gets reloaded afterwards.
   *
   * @param reload is a boolean which indicates whether to reload the
   * replenishment list after the dialog closes
   */
  closeDialog(reload: boolean) {
    this.dialogRef.close(reload);
  }

  /**
   * This method returns the product with the searched ID by searching for it
   * in the list "products".
   * @param id is the product id.
   */
  getProductByID(id: number): Product {
    return this.products.find(p => p.id === id);
  }

  /**
   * This method filters the products by a search string.
   * @param value is the search value.
   */
  private _filterStates(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(p => p.name.toLowerCase().indexOf(filterValue) >= 0);
  }
}
