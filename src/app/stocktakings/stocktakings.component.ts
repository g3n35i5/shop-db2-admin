import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { CustomTimestamp } from '../filters';
import { StocktakingCollection } from '../interfaces/stocktaking';
import { CreateStocktakingCollectionComponent } from './createstocktakingcollection/createstocktakingcollection.component';
import {StocktakingcollectioninfoComponent} from './stocktakingcollectioninfo/stocktakingcollectioninfo.component';
import {ProductinfoComponent} from '../products/productinfo/productinfo.component';


@Component({
  selector: 'app-stocktakings',
  templateUrl: './stocktakings.component.html',
  styleUrls: ['./stocktakings.component.scss']
})
export class StocktakingsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public stocktakingcollections: StocktakingCollection[];
  private users;
  public products;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'timestamp', 'admin', 'info', 'revoke', 'balance'];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  toggleRevoke(collection: StocktakingCollection): void {
    this.disableInteraction = true;
    const data = {revoked: !collection.revoked};
    this.dataService.toggleStocktakingCollectionRevoke(collection.id, data).subscribe(() => {
      this.loadData();
    }, () => {
      this.disableInteraction = false;
    });
  }

  getInfo(_collection: StocktakingCollection) {
    this.dataService.getStocktakingCollection(_collection.id).subscribe(collection => {
      collection['balance'] = _collection.balance;
      const dialogRef = this.dialog.open(StocktakingcollectioninfoComponent, {
        width: '1200px',
        data : collection
      });

      dialogRef.afterClosed().subscribe(() => {
        this.loadData();
      });
    });
  }

  createStocktakingCollection() {
    const dialogRef = this.dialog.open(CreateStocktakingCollectionComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  getUserNameByID(id: number): string {
    const user = this.users.find(u => u.id === id);
    if (user === 'undefined') {
      return 'unknown';
    }
    return user.lastname + ', ' + user.firstname;
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const stocktakings = this.dataService.getStocktakingCollections();
    const users = this.dataService.getUsers();
    forkJoin([stocktakings, users]).subscribe(results => {
      this.stocktakingcollections = <StocktakingCollection[]>results[0];
      this.users = results[1];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.stocktakingcollections.length > 0) {
      this.dataSource = new MatTableDataSource(this.stocktakingcollections);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }

    this.loading = false;
    this.disableInteraction = false;
    this.loadStocktakingBalances();
  }

  loadStocktakingBalances() {
    const stocktakings = this.stocktakingcollections.filter(collection => !collection.revoked);
    const numStocktakings = stocktakings.length;
    if (numStocktakings < 2) {
      return;
    }
    stocktakings[0].is_first = true;
    for (let index = numStocktakings - 1; index >= 1; index --) {
      const end_id = stocktakings[index]['id'];
      const start_id = stocktakings[index - 1]['id'];
      this.dataService.getBalanceBetweenStocktakings(start_id, end_id).subscribe(res => {
        this.stocktakingcollections.find(item => item.id === end_id).balance = res;
      });
    }
  }

  /** Filter the stocktakings depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStocktakingTemplate() {
    this.dataService.getStocktakingTemplate();
  }
}
