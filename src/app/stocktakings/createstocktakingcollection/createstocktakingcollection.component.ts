import {Component, OnInit, Inject} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {DataService} from '../../services/data/data.service';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  FormArray
} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {Product} from '../../interfaces/product';
import {Stocktaking} from '../../interfaces/stocktaking';

@Component({
  selector: 'app-createstocktakingcollection',
  templateUrl: './createstocktakingcollection.component.html',
  styleUrls: ['./createstocktakingcollection.component.scss']
})

export class CreateStocktakingCollectionComponent implements OnInit {

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CreateStocktakingCollectionComponent>
  ) {
    this.form = this.fb.group({
      counts: this.fb.array([])
    });
  }

  form: FormGroup;

  public loading: boolean;
  private products: Product[];

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
w
  processingData() {
    this.products = this.products.filter(product => product.active);
    const ctrl = <FormArray>this.form.controls.counts;
    this.products.forEach(product => {
      ctrl.push(this.fb.group({
        product_id: product.id,
        count: [null, [Validators.required, Validators.min(0)]],
        set_inactive: [false, [Validators.required]]
      }));
    });
    this.loading = false;
  }

  checkboxDisabled(foo): boolean {
    return foo.controls.count.value !== 0;
  }

  /**
   * This method is called on pressing the submit button. It creates a
   * replenishmentcollection from all replenishment and sends it to the API.
   */
  submit(): void {
    // If there are no replenishments yet, display an error message.
    if (this.form.invalid) {
      this.snackbar.openSnackBar('The form is invalid');
      return;
    }

    const data = {stocktakings: this.form.value.counts};

    console.log(data);

    // Send it to the API and close the dialog on success.
    this.dataService.createStocktakingCollection(data).subscribe(() => {
      this.closeDialog(true);
    });
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
  // close(): void {
  //   if (this.replenishmentList.length === 0 && this.commentCtrl.untouched) {
  //     this.closeDialog(false);
  //   }
  //   if (this.closeAttempt) {
  //     this.closeDialog(false);
  //     return;
  //   }
  //   this.closeAttempt = true;
  // }

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
  // private _filterStates(value: string): Product[] {
  //   const filterValue = value.toLowerCase();
  //   return this.products.filter(p => p.name.toLowerCase().indexOf(filterValue) >= 0);
  // }
}
