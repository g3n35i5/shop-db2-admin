import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';
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
  public ranks;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 50;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'rank',
                                'verify', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackbar: SnackbarService,
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
    });
  }

  /** Verify a user. */
  verifyUser(user) {
    if (user['rankID'] === -1 ) {
      this.snackbar.openSnackBar('Select a rank for the user', '', 'error');
    } else {
      this.dataService.verifyUser(user.id, user['rankID']).subscribe(() => {
        this.loadData();
      });
    }
  }

  /** Load all necessary data from the backend. */
  loadData() {
    this.loading = true;
    const users = this.dataService.getPendingVerifications();
    const ranks = this.dataService.getRanks();
    forkJoin([users, ranks]).subscribe(results => {
      this.users = results[0]['pending_validations'];
      this.ranks = results[1]['ranks'];
      this.processingData();
    });
  }

  setUserRank(rankID, user) {
    user.rankID = rankID;
  }

  /** Process the loaded data and ends the loading state. */
  processingData() {
    if (this.users.length > 0) {
      for (const user of this.users) {
        user.rankID = -1;
      }
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
