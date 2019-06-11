import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { CreateRefundComponent } from './create-refund/create-refund.component';
import { CustomTimestamp } from '../filters';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public refunds;
  private datePipe = new CustomTimestamp();
  public users;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'amount',
    'comment', 'timestamp', 'revoke'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  /** Open a dialog for creating a refund. */
  createRefund(): void {
    const dialogRef = this.dialog.open(CreateRefundComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  /** Revoke a refund. */
  toggleRevoke(refund) {
    this.disableInteraction = true;
    const data = { revoked: !refund.revoked };
    this.dataService.toggleRefundRevoke(refund.id, data).subscribe(() => {
      this.loadData();
    }, () => {
      this.disableInteraction = false;
    });
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const users = this.dataService.getUsers();
    const refunds = this.dataService.getRefunds();
    forkJoin([users, refunds]).subscribe(results => {
      this.users = results[0]['users'];
      this.refunds = results[1]['refunds'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.refunds.length > 0) {
      for (const refund of this.refunds) {
        const user = this.users.find(u => u.id === refund.user_id);
        refund.timestamp = this.datePipe.transform(refund.timestamp);
        refund.firstname = user.firstname;
        refund.lastname = user.lastname;
      }
      this.dataSource = new MatTableDataSource(this.refunds);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the refunds depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
