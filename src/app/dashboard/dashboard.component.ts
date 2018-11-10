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

  private users;
  private deposits;
  private purchases;
  private products;

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
  }

  loadData() {
    const users = this.dataService.getUsers();
    const deposits = this.dataService.getDeposits();
    const purchases = this.dataService.getPurchases();
    const products = this.dataService.getProducts();
    forkJoin([users, deposits, purchases, products]).subscribe(results => {
      this.users = results[0]['users'];
      this.deposits = results[1]['deposits'];
      this.purchases = results[2]['purchases'];
      this.products = results[3]['products'];
      this.processingData();
    });
  }
}
