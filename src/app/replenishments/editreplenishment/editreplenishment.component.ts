import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {DataService} from '../../services/data/data.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent,
  MatDialogRef
} from '@angular/material';
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
  selector: 'app-editreplenishment',
  templateUrl: './editreplenishment.component.html',
  styleUrls: ['./editreplenishment.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
    ]
})
export class EditreplenishmentComponent implements OnInit {

  constructor(
    private snackbar: SnackbarService,
    private dataService: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<EditreplenishmentComponent>
  ) { }

  public replenishmentcollection;
  private editReplenishmentcollection;
  public loading: boolean;
  form: FormGroup;
  private formSubmitAttempt: boolean;
  public maxDate: moment.Moment = moment().tz('Europe/Berlin');


  ngOnInit() {
    this.loading = true;
    this.replenishmentcollection = this.data.replenishmentcollection;

    this.editReplenishmentcollection =  Object.assign({}, this.replenishmentcollection);

    const timestamp = moment(new Date(this.editReplenishmentcollection.timestamp)).tz('Europe/Berlin');
    console.log(this.editReplenishmentcollection.timestamp);
    console.log(typeof this.editReplenishmentcollection.timestamp);
    console.log(timestamp)
    /** Create a new form*/
    this.form = this.fb.group({
      comment: [this.editReplenishmentcollection.comment, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32)])],
      timestamp: [this.editReplenishmentcollection.timestamp, Validators.compose([
        Validators.required])],
      time: [timestamp.format('HH:mm'), [Validators.required]],
      date: [timestamp, [Validators.required]]
    });
    this.loading = false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }



  submitForm() {
    this.updateProduct();
  }

  updateProduct() {
    const data = {};
    const form_data = this.form.value;
    data['comment'] = form_data['comment'];
    const updateData = {};
    const timestamp = moment(this.replenishmentcollection.timestamp).tz('Europe/Berlin');

    const year = form_data['date'].year();
    const month = form_data['date'].month();
    const date = form_data['date'].date();
    const hour = Number(form_data['time'].split(':')[0]);
    const minute = Number(form_data['time'].split(':')[1]);

    let updated = false;

    if (timestamp.year() !== year) {
      updated = true;
    } else if (timestamp.month() !== month) {
      updated = true;
    } else if (timestamp.date() !== date) {
      updated = true;
    } else if (timestamp.hour() !== hour) {
      updated = true;
    } else if (timestamp.minute() !== minute) {
      updated = true;
    }

    if (updated) {
      timestamp.set({'year': year, 'month': month, 'date': date, 'hour': hour, 'minute': minute});
      data['timestamp'] = timestamp.unix();
    }

    for (const [key, value] of Object.entries(data)) {
      if (this.replenishmentcollection.hasOwnProperty(key)) {
        if (value !== this.replenishmentcollection[key]) {
          updateData[key] = value;
        }
      } else {
        this.snackbar.openSnackBar('Invalid form data');
        return;
      }
    }

    if (Object.keys(updateData).length !== 0) {
      this.dataService.updateReplenishmentCollection(this.replenishmentcollection.id, updateData).subscribe(() => {
        this.closeDialog(true);
      });
    } else {
      this.snackbar.openSnackBar('Nothing has changed');
      this.closeDialog(false);

    }
  }

  closeDialog(reload: boolean) {
    this.dialogRef.close(reload);
  }
}
