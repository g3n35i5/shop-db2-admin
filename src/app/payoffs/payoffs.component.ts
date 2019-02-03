import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { CreatePayoffComponent } from './create-payoff/create-payoff.component';
import { CustomTimestamp } from '../filters';

@Component({
  selector: 'app-payoffs',
  templateUrl: './payoffs.component.html',
  styleUrls: ['./payoffs.component.scss']
})
export class PayoffsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public payoffs;
  private datePipe = new CustomTimestamp();
  public users;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'amount', 'comment', 'timestamp', 'revoke'];
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

  /** Open a dialog for creating a payoff. */
  createPayoff(): void {
    const dialogRef = this.dialog.open(CreatePayoffComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  /** Revoke a payoff. */
  toggleRevoke(payoff) {
    this.disableInteraction = true;
    const data = { revoked: !payoff.revoked };
    this.dataService.togglePayoffRevoke(payoff.id, data).subscribe(() => {
      this.loadData();
    }, () => {
      this.disableInteraction = false;
    });
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const users = this.dataService.getUsers();
    const payoffs = this.dataService.getPayoffs();
    forkJoin([users, payoffs]).subscribe(results => {
      this.users = results[0]['users'];
      this.payoffs = results[1]['payoffs'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.payoffs.length > 0) {
      for (const payoff of this.payoffs) {
        payoff.timestamp = this.datePipe.transform(payoff.timestamp);
      }
      this.dataSource = new MatTableDataSource(this.payoffs);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the payoffs depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
