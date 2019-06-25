import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DataService } from '../services/data/data.service';
import { forkJoin } from 'rxjs';
import { ProductinfoComponent } from './productinfo/productinfo.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { CreateProductComponent } from './createproduct/createproduct.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  /** Define all needed variables. */
  public loading: boolean;
  public disableInteraction: boolean;
  public showTable: boolean;
  public products;
  public tags;
  public tagMap = new Map();
  public dataSource;
  public itemsPerPage = [5, 10, 20, 50];
  public numItems = 10;
  displayedColumns: string[] = ['id', 'name', 'price', 'pricehistory',
                                'info', 'edit'];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  /** Load all necessary data from the backend. */
  loadData() {
    this.loading = true;
    const products = this.dataService.getProducts();
    forkJoin([products]).subscribe(results => {
      this.products = results[0]['products'];
      this.processingData();
    });
  }

  /** Process the loaded data and ends the loading state.  */
  processingData() {
    if (this.products.length > 0) {
      this.dataSource = new MatTableDataSource(this.products);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showTable = true;
    } else {
      this.showTable = false;
    }

    this.loading = false;
    this.disableInteraction = false;
  }

  /** Filter the products depending on the current filter value.  */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  createProduct() {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  /** Open a dialog for editing the product */
  editProduct(product): void {
    this.dataService.getProduct(product.id).subscribe(full_product => {
      const dialogRef = this.dialog.open(EditproductComponent, {
        width: '500px',
        data : full_product
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadData();
        }
      });
    });
  }

  /** Open a dialog showing the product info. */
  productInfo(product): void {
    this.dataService.getProduct(product.id).subscribe(full_product => {
      const dialogRef = this.dialog.open(ProductinfoComponent, {
        width: '500px',
        data : full_product
      });
    });
  }
}
