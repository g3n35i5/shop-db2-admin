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
  displayedColumns: string[] = ['id', 'timestamp', 'admin', 'info', 'revoke'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
      const dialogRef = this.dialog.open(StocktakingcollectioninfoComponent, {
        width: '500px',
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
      this.stocktakingcollections = results[0]['stocktakingcollections'];
      this.users = results[1]['users'];
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
  }

  /** Filter the stocktakings depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
