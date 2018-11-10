import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-productinfo',
  templateUrl: './productinfo.component.html',
  styleUrls: ['./productinfo.component.scss']
})
export class ProductinfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<ProductinfoComponent>
  ) { }

  public product;
  public loading: boolean;

  ngOnInit() {
    this.loading = true;
    this.product = this.data.product;
    console.log(this.product)
    this.loading = false;
  }

  imageURL(): string {
    return '/api/images/' + (this.product.imagename || '');
  }
}
