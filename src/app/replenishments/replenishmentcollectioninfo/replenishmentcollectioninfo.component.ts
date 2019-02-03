import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../../services/data/data.service';
import {forkJoin} from 'rxjs';
import {Replenishment} from '../../interfaces/replenishment';
import {Product} from '../../interfaces/product';
import {ReplenishmentCollection} from '../../interfaces/replenishmentcollection';

@Component({
  selector: 'app-replenishmentcollectioninfo',
  templateUrl: './replenishmentcollectioninfo.component.html',
  styleUrls: ['./replenishmentcollectioninfo.component.scss']
})
export class ReplenishmentcollectioninfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<ReplenishmentcollectioninfoComponent>,
    private dataService: DataService
  ) { }

  private rID: number;
  public collection: ReplenishmentCollection;
  public disableInteraction = false;
  public products;
  public loading: boolean;

  ngOnInit() {
    this.rID = this.data.id;
    this.loadData();
  }

  imagePath(replenishment: Replenishment): string {
    const product: Product = this.getProductByID(replenishment.product_id);
    const path = '/api/images/';
    return product.imagename !== null ? path + product.imagename : path;
  }
  /**
   * This method returns the product with the searched ID by searching for it
   * in the list "products".
   * @param id is the product id.
   */
  getProductByID(id: number): Product {
    return this.products.find(p => p.id === id);
  }

  toggleRevoke(item: Replenishment): void {
    this.disableInteraction = true;
    const data = { revoked: !item.revoked };
    this.dataService.toggleReplenishmentRevoke(item.id, data).subscribe(() => {
      this.loadData();
    }, () => {
      this.disableInteraction = false;
    });
  }


  loadData() {
    this.loading = true;
    this.disableInteraction = true;
    const collection = this.dataService.getReplenishmentCollection(this.rID);
    const products = this.dataService.getProducts();
    forkJoin([products, collection]).subscribe(result => {
      this.products = result[0]['products'];
      this.collection = result[1]['replenishmentcollection'];
      this.processingData();
    });
  }

  processingData() {
    this.loading = false;
    this.disableInteraction = false;
  }
}
