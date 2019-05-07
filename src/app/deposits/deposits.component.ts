import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { CreateDepositComponent } from './create-deposit/create-deposit.component';
import { CustomTimestamp } from '../filters';
import { CreateBatchDepositComponent } from './create-batch-deposit/create-batch-deposit.component';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss']
})
export class DepositsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public deposits;
  private datePipe = new CustomTimestamp();
  public users;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'amount',
                                'comment', 'timestamp', 'revoke'];
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

  /** Open a dialog for creating a deposit. */
  createDeposit(): void {
    const dialogRef = this.dialog.open(CreateDepositComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  /** Open a dialog for creating a deposit. */
  createBatchDeposit(): void {
    const dialogRef = this.dialog.open(CreateBatchDepositComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  /** Revoke a deposit. */
  toggleRevoke(deposit) {
    this.disableInteraction = true;
    const data = { revoked: !deposit.revoked };
    this.dataService.toggleDepositRevoke(deposit.id, data).subscribe(() => {
      this.loadData();
    }, () => {
      this.disableInteraction = false;
    });
  }

  /** Load all nescessary data from the backend. */
  loadData() {
    const users = this.dataService.getUsers();
    const deposits = this.dataService.getDeposits();
    forkJoin([users, deposits]).subscribe(results => {
      this.users = results[0]['users'];
      this.deposits = results[1]['deposits'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.deposits.length > 0) {
      for (const deposit of this.deposits) {
        const user = this.users.find(u => u.id === deposit.user_id);
        deposit.timestamp = this.datePipe.transform(deposit.timestamp);
        deposit.firstname = user.firstname;
        deposit.lastname = user.lastname;
      }
      this.dataSource = new MatTableDataSource(this.deposits);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the deposits depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
