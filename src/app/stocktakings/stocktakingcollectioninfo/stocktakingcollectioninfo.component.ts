import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../../services/data/data.service';
import {forkJoin} from 'rxjs';
import {Product} from '../../interfaces/product';
import {StocktakingCollection} from '../../interfaces/stocktaking';

@Component({
  selector: 'app-stocktakingcollectioninfo',
  templateUrl: './stocktakingcollectioninfo.component.html',
  styleUrls: ['./stocktakingcollectioninfo.component.scss']
})
export class StocktakingcollectioninfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<StocktakingcollectioninfoComponent>,
    private dataService: DataService
  ) { }

  public stocktakingcollection: StocktakingCollection;
  public products: Product[];
  public loading: boolean;

  ngOnInit() {
    //  Get a copy of the stocktakingcollection.
    this.stocktakingcollection = this.data.stocktakingcollection;
    console.log(this.stocktakingcollection);
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const products = this.dataService.getProducts();
    forkJoin([products]).subscribe(result => {
      this.products = result[0]['products'];
      this.processingData();
    });
  }

  /**
   * This method returns the product with the searched ID by searching for it
   * in the list "products".
   * @param id is the product id.
   */
  getProductByID(id: number): Product {
    return this.products.find(p => p.id === id);
  }

  processingData() {
    this.loading = false;
  }
}
