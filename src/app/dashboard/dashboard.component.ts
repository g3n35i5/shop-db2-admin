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
  private replenishments;
  private refunds;
  private payoffs;
  private financial_overview;

  public barChartData: any[] = [];

  public barChartLabels: string[] = ['Incomes', 'Expenses'];

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
      icon: 'restaurant_menu',
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
      icon: 'attach_money',
      number: null,
      color: '#E91E63',
      link: '/deposits'
    },
    {
      title: 'Replenishments',
      icon: 'shopping_basket',
      number: null,
      color: '#E91E63',
      link: '/replenishments'
    },
    {
      title: 'Refunds',
      icon: 'settings_backup_restore',
      number: null,
      color: '#E91E63',
      link: '/refunds'
    },
    {
      title: 'Payoffs',
      icon: 'euro_symbol',
      number: null,
      color: '#E91E63',
      link: '/payoffs'
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
    this.tiles[4].number = this.replenishments.length;
    this.tiles[5].number = this.refunds.length;
    this.tiles[6].number = this.payoffs.length;

    const incomes = this.financial_overview['incomes']['items'];
    const expenses = this.financial_overview['expenses']['items'];

    const incomes_keys = incomes.map(x => x['name']);
    const expenses_keys = expenses.map(x => x['name']);
    const keys = new Set(incomes_keys.concat(expenses_keys));

    keys.forEach(key => {
      const income = incomes.find(i => i['name'] === key);
      const expense = expenses.find(i => i['name'] === key);
      this.barChartData.push({data: [income['amount'] / 100, expense['amount'] / 100], label: key});
    });

    this.loading = false;
  }

  loadData() {
    this.loading = true;
    const users = this.dataService.getUsers();
    const deposits = this.dataService.getDeposits();
    const purchases = this.dataService.getPurchases();
    const products = this.dataService.getProducts();
    const replenishments = this.dataService.getReplenishmentCollections();
    const refunds = this.dataService.getRefunds();
    const payoffs = this.dataService.getPayoffs();
    const financial_overview = this.dataService.getFinancialOverview();
    forkJoin([users, deposits, purchases, products, replenishments, refunds, payoffs, financial_overview])
      .subscribe(results => {
      this.users = results[0]['users'];
      this.deposits = results[1]['deposits'];
      this.purchases = results[2]['purchases'];
      this.products = results[3]['products'];
      this.replenishments = results[4]['replenishmentcollections'];
      this.refunds = results[5]['refunds'];
      this.payoffs = results[6]['payoffs'];
      this.financial_overview = results[7]['financial_overview'];
      this.processingData();
    });
  }
}
