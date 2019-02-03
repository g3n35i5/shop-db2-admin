import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { CustomTimestamp } from '../filters';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  private datePipe = new CustomTimestamp();
  public purchases;
  public products;
  public users;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'productname',
                                'amount', 'timestamp', 'productprice', 'price',
                                'revoke'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  /** Revoke a purchase. */
  toggleRevoke(purchase) {
    this.disableInteraction = true;
    const data = { revoked: !purchase.revoked };
    this.dataService.togglePurchaseRevoke(purchase.id, data).subscribe(() => {
      this.loadData();
    }, () => {
      this.disableInteraction = false;
    });
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const users = this.dataService.getUsers();
    const purchases = this.dataService.getPurchases();
    const products = this.dataService.getProducts();
    forkJoin([users, purchases, products]).subscribe(results => {
      this.users = results[0]['users'];
      this.purchases = results[1]['purchases'];
      this.products = results[2]['products'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.purchases.length > 0) {
      for (const purchase of this.purchases) {
        const user = this.users.find(u => u.id === purchase.user_id);
        const product = this.products.find(p => p.id === purchase.product_id);
        purchase.firstname = user.firstname;
        purchase.lastname = user.lastname;
        purchase.productname = product.name;
        purchase.timestamp = this.datePipe.transform(purchase.timestamp);
      }
      this.dataSource = new MatTableDataSource(this.purchases);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the purchases depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
