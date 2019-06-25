import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import {MatDialog} from '@angular/material';
import {DataService} from '../services/data/data.service';
import {forkJoin} from 'rxjs';
import {CustomTimestamp} from '../filters';
import {CreateReplenishmentComponent} from './createreplenishment/createreplenishment.component';
import {ReplenishmentCollection} from '../interfaces/replenishmentcollection';
import {ReplenishmentcollectioninfoComponent} from './replenishmentcollectioninfo/replenishmentcollectioninfo.component';
import {ProductinfoComponent} from '../products/productinfo/productinfo.component';

@Component({
  selector: 'app-replenishments',
  templateUrl: './replenishments.component.html',
  styleUrls: ['./replenishments.component.scss']
})
export class ReplenishmentsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  private datePipe = new CustomTimestamp();
  public replenishments;
  private users;
  public products;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'timestamp', 'admin', 'comment', 'price', 'info', 'revoke'];
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

  toggleRevoke(collection: ReplenishmentCollection): void {
    this.disableInteraction = true;
    const data = {revoked: !collection.revoked};
    this.dataService.toggleReplenishmentCollectionRevoke(collection.id, data).subscribe(() => {
      this.loadData();
    }, () =>{
      this.disableInteraction = false;
    });
  }

  getInfo(collection: ReplenishmentCollection) {
    const dialogRef = this.dialog.open(ReplenishmentcollectioninfoComponent, {
      width: '800px',
      data: {id: collection.id}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  createReplenishment() {
    const dialogRef = this.dialog.open(CreateReplenishmentComponent, {
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
    const replenishments = this.dataService.getReplenishmentCollections();
    const users = this.dataService.getUsers();
    forkJoin([replenishments, users]).subscribe(results => {
      this.replenishments = results[0]['replenishmentcollections'];
      this.users = results[1]['users'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.replenishments.length > 0) {
      for (const replenishment of this.replenishments) {
        replenishment.timestamp = this.datePipe.transform(replenishment.timestamp);
      }
      this.dataSource = new MatTableDataSource(this.replenishments);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the replenishments depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
