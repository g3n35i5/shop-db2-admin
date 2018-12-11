import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';

interface Tile {
  title: string;
  icon: string;
  number: number;
  color: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public loading: boolean;
  private users;
  private deposits;
  private purchases;
  private products;
  private financial_overview;
  public chartData: any = [];
  public chartLabels: string[] = ['Incomes', 'Expenses'];

  chartOptions = {
    type: 'bar',
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          return Number(tooltipItem.yLabel).toFixed(2) + ' €';
        }
      }
    },
    legend: {
      display: true,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: '€'
        }
      }]
    }
  };

  constructor(
    private dataService: DataService
  ) { }

  public tiles: Tile[] = [
    {
      title: 'Users',
      icon: 'group',
      number: null,
      color: '#3F51B5',
      link: '/users'
    },
    {
      title: 'Products',
      icon: 'fastfood',
      number: null,
      color: '#8BC34A',
      link: '/products'
    },
    {
      title: 'Purchases',
      icon: 'shopping_cart',
      number: null,
      color: '#2196F3',
      link: '/purchases'
    },
    {
      title: 'Deposits',
      icon: 'money',
      number: null,
      color: '#E91E63',
      link: '/deposits'
    }
  ];

  ngOnInit() {
    this.loadData();
  }

  processingData() {
    this.tiles[0].number = this.users.length;
    this.tiles[1].number = this.products.length;
    this.tiles[2].number = this.purchases.length;
    this.tiles[3].number = this.deposits.length;
    const expenses = this.financial_overview['expenses']['items'];
    const incomes = this.financial_overview['incomes']['items'];

    for (const inc of incomes) {
      this.chartData.push({data: [inc.amount / 100], label: inc.name, stack: '1'});
    }

    for (const ex of expenses) {
      this.chartData.push({data: [ex.amount / 100], label: ex.name, stack: '2'});
    }
    this.loading = false;
  }

  loadData() {
    this.loading = true;
    const users = this.dataService.getUsers();
    const deposits = this.dataService.getDeposits();
    const purchases = this.dataService.getPurchases();
    const products = this.dataService.getProducts();
    const financial_overview = this.dataService.getFinancialOverview();
    forkJoin([users, deposits, purchases, products, financial_overview])
      .subscribe(results => {
      this.users = results[0]['users'];
      this.deposits = results[1]['deposits'];
      this.purchases = results[2]['purchases'];
      this.products = results[3]['products'];
      this.financial_overview = results[4]['financial_overview'];
      this.processingData();
    });
  }
}
