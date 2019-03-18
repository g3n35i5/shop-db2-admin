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
import { forkJoin } from 'rxjs';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {Product} from '../../interfaces/product';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-createstocktakingcollection',
  templateUrl: './createstocktakingcollection.component.html',
  styleUrls: ['./createstocktakingcollection.component.scss'],
  providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
]
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
      counts: this.fb.array([]),
      time: ['', [Validators.required]],
      date: [moment(), [Validators.required]]
    });
  }

  form: FormGroup;
  // The maximum date is today.
  public maxDate: moment.Moment = moment();

  public timestamp = '';

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

  processingData() {
    this.products = this.products.filter(product => product.active);
    this.products = this.products.filter(product => product.countable);
    this.products.sort((a, b) => a.name.localeCompare(b.name));
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

    const time = this.form.controls['time'].value.split(':');
    const hour = Number(time[0]);
    const minute = Number(time[1]);
    const day = this.form.controls['date'].value.day();
    const month = this.form.controls['date'].value.month();
    const year = this.form.controls['date'].value.year();

    const timestamp = moment();
    timestamp.set('day', day);
    timestamp.set('month', month);
    timestamp.set('year', year);
    timestamp.set('hour', hour);
    timestamp.set('minute', minute);
    timestamp.set('second', 0);
    timestamp.set('millisecond', 0);

    if (timestamp > moment()) {
      this.snackbar.openSnackBar('Invalid date/time');
      return;
    }

    const data = {
      stocktakings: this.form.value.counts,
      timestamp: Number(timestamp.valueOf() / 1000)
    };

    // Send it to the API and close the dialog on success.
    this.dataService.createStocktakingCollection(data).subscribe(() => {
      this.closeDialog(true);
    });
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
}
