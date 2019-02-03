import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { CustomTimestamp } from '../filters';
import { LocalTimezone } from '../filters';
import { CustomCurrency } from '../filters';

@Component({
  selector: 'app-pricehistory',
  templateUrl: './pricehistory.component.html',
  styleUrls: ['./pricehistory.component.scss']
})
export class PricehistoryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  public loading: boolean;
  public product: any;
  public chartData: any = [];
  private data: any[] = [];
  public minDate: Date;
  public maxDate: Date;
  private timezonePipe = new LocalTimezone();
  private datePipe = new CustomTimestamp();
  private currencyPipe = new CustomCurrency();

  chartOptions = {
    type: 'line',
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          return Number(tooltipItem.yLabel) + '€';
        }
      }
    },
    legend: {
       display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          parser: 'DD.MM.YYYY HH:mm:ss'
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          max: null
        },
        scaleLabel: {
          display: true,
          labelString: ' Price in Euro'
        }
      }]
    }
  };

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  processingData(): void {
    const pricehistory = this.product.pricehistory;
    const dates = [];
    for (const date of pricehistory.map(ph => ph.timestamp)) {
      dates.push(this.timezonePipe.transform(date));
    }

    const maxPrice = Math.max(...pricehistory.map(ph => ph.price)) / 100;
    this.chartOptions.scales.yAxes[0].ticks.max = maxPrice + 0.5;
    for (const entry of pricehistory) {
      this.data.push(
        {
          t: this.timezonePipe.transform(entry.timestamp),
          y: this.currencyPipe.transform(entry.price)
        }
      );
    }
    /** Append the current date in order to show the complete graph. */
    this.data.push({
      t: this.timezonePipe.transform(new Date().toString()),
      y: this.data.slice(-1)[0]
    });

    this.getMaxDate();
    this.chartData.push({
      data: this.data, label: 'Pricehistory', steppedLine: true
    });
    this.loading = false;
  }

  getMaxDate(): Date {
    const dates = this.data.map(d => Date.parse(d.t));
    return new Date();
  }

  loadData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const product = this.dataService.getProduct(+id);
    forkJoin([product]).subscribe(results => {
      this.product = results[0]['product'];
      this.processingData();
    });
  }

}
