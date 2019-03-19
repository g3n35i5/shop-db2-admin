import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public showTable: boolean;
  public users;
  public ranks;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'isadmin',
                                'rank', 'credit', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  createUser() {
    alert('Please use the registration site!');
  }

  /** Return the color for the user credit. */
  creditColor(credit) {
    return credit >= 0 ? 'black' : 'red';
  }

  /** Open a dialog for editing a user's data. */
  editUser(user): void {
    this.dataService.getUser(user.id).subscribe(full_user => {
      const data = {user: full_user['user'], ranks: this.ranks};
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '400px',
        data : data
      });
      dialogRef.afterClosed().subscribe(() => {
        this.loadData();
      });
    });
  }

  /** Load all nescessary data from the backend. */
  loadData() {
    this.loading = true;
    const users = this.dataService.getUsers();
    const ranks = this.dataService.getRanks();
    forkJoin([users, ranks]).subscribe(results => {
      this.users = results[0]['users'];
      this.ranks = results[1]['ranks'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.users.length > 0) {
      for (const user of this.users) {
        user.rankname = this.ranks.find(x => x.id === user.rank_id).name;
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
