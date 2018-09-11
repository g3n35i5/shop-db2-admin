import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.scss']
})
export class VerificationsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public showTable: boolean;
  public users;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 50;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email',
                                'verify', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  /** Delete a user. */
  deleteUser(user) {
    this.dataService.deleteUser(user.id).subscribe(() => {
      this.loadData();
    })
  }

  /** Verify a user. */
  verifyUser(user) {
    this.dataService.verifyUser(user.id).subscribe(() => {
      this.loadData();
    })
  }

  /** Load all nescessary data from the backend. */
  loadData() {
    this.loading = true;
    let users = this.dataService.getPendingVerifications();
    forkJoin([users]).subscribe(results => {
      this.users = results[0]['pending_validations'];
      this.processingData()
    });
  }

  /** Process the loaded data and ends the loading state. */
  processingData() {
    if (this.users.length > 0) {
      this.dataSource = new MatTableDataSource(this.users);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
  }

  /** Filter the users depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
