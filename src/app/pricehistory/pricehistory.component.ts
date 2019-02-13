import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data/data.service';
import { CustomCurrency } from '../filters';
import { forkJoin } from 'rxjs';
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

import { FormControl } from '@angular/forms';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-pricehistory',
  templateUrl: './pricehistory.component.html',
  styleUrls: ['./pricehistory.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class PricehistoryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private snackbar: SnackbarService
  ) { }

  public startDate = new FormControl(moment());
  public endDate = new FormControl(moment());

  public loading: boolean;
  public product: any;
  public showChart = false;
  private pricehistory: any;
  public chartData: any = [];
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  private currencyPipe = new CustomCurrency();

  chartOptions = {
    elements: { point: { radius: 0 } },
    legend: { display: false },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day',
          min: null,
          max: null
        },
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return value.toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR'
            });
          }
        },
        scaleLabel: {
          display: true,
          labelString: 'Price'
        }
      }]
    }
  };

  ngOnInit() {
    this.loading = true;
    this.showChart = false;
    // The maximum date is today.
    this.maxDate = moment();
    this.loadData();
  }

  processingData(): void {
    if (this.pricehistory.length === 0) {
      this.showChart = false;
      this.loading = false;
      return;
    }

    // Set the initial range to one week (or begin at the creation date)
    this.endDate.setValue(this.maxDate);
    this.minDate = moment(this.product['creation_date']);
    const one_week = moment().subtract(1, 'w');
    if (this.minDate > one_week) {
      this.startDate.setValue(this.minDate);
    } else {
      this.startDate.setValue(one_week);
    }

    // Map the data
    const data = this.pricehistory.map((item) => {
      return {
        t: moment(item['timestamp']),
        y: this.currencyPipe.transform(item['price'])
      };
    });

    // Append the current price today.
    data.push({t: moment(), y: data.slice(-1)[0].y});

    this.chartData = [{data: data, steppedLine: true}];
    this.applyTimeRange();
    this.loading = false;
  }

  applyTimeRange(): void {
    setTimeout(() => {this.showChart = false; }, 0);
    const start = moment(this.startDate.value.valueOf());
    const end = moment(this.endDate.value.valueOf());

    if (start >= end) {
      this.snackbar.openSnackBar('The start date must be before the end date');
      return;
    }

    // Apply the limit to the chart.
    this.chartOptions.scales.xAxes[0].time.min = start;
    this.chartOptions.scales.xAxes[0].time.max  = end;
    setTimeout(() => { this.showChart = true; }, 0);
  }

  loadData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const product = this.dataService.getProduct(+id);
    const pricehistory = this.dataService.getProductPricehistory(+id);
    forkJoin([product, pricehistory]).subscribe(results => {
      this.product = results[0]['product'];
      this.pricehistory = results[1]['pricehistory'];
      this.processingData();
    });
  }
}
