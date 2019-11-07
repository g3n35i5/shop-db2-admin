import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-productinfo',
  templateUrl: './productinfo.component.html',
  styleUrls: ['./productinfo.component.scss']
})
export class ProductinfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<ProductinfoComponent>,
    private dataService: DataService
  ) { }

  public product;
  public loading: boolean;
  private tagMap = new Map();
  private tags;

  ngOnInit() {
    //  Get a copy of the product.
    this.product = this.data;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const tags = this.dataService.getProducttags();
    forkJoin([tags]).subscribe(result => {
      this.tags = result[0];
      this.processingData();
    });
  }

  processingData() {
    Array.from(this.tags).forEach((tag => {
      this.tagMap.set(tag['id'], tag['name']);
    }));
    const tagIDs = this.product.tags;
    const tagNames = [];
    delete this.product.tags;

    for (const tagID of tagIDs) {
      tagNames.push(this.tagMap.get(tagID));
    }
    this.product.tags = tagNames.join(', ');

    this.loading = false;
  }

  imageURL(): string {
    return '/api/images/' + (this.product.imagename || '');
  }
}
