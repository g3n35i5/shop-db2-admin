import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import {CreateTagComponent} from './createtag/createtag.component';
import {EditTagComponent} from './edittag/edittag.component';
import {EditUserComponent} from '../users/edit-user/edit-user.component';

@Component({
  selector: 'app-producttags',
  templateUrl: './producttags.component.html',
  styleUrls: ['./producttags.component.scss']
})
export class ProducttagsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public producttags;
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'name', 'edit', 'delete'];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  deleteTag(tag) {
    this.dataService.deleteProducttag(tag.id).subscribe(() => {
      this.loadData();
    })
  }

  editTag(tag) {
    this.dataService.getProducttag(tag.id).subscribe(rank => {
      const dialogRef = this.dialog.open(EditTagComponent, {
        width: '400px',
        data : rank
      });
      dialogRef.afterClosed().subscribe(() => {
        this.loadData();
      });
    });
  }

  createTag() {
    const dialogRef = this.dialog.open(CreateTagComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  /** Load all nescessary data from the backend. */
  loadData() {
    const producttags = this.dataService.getProducttags();
    forkJoin([producttags]).subscribe(results => {
      this.producttags = results[0];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.producttags.length > 0) {
      for (const tag of this.producttags) {
      }
      this.dataSource = new MatTableDataSource(this.producttags);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }
    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the producttags depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
