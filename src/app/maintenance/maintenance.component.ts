import { Component, OnInit } from '@angular/core';
import {forkJoin} from 'rxjs';
import {DataService} from '../services/data/data.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  public loading: boolean;
  public maintenanceMode: boolean;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  /** Load all necessary data from the backend. */
  loadData() {
    const maintenanceMode = this.dataService.getMaintenanceMode();
    forkJoin([maintenanceMode]).subscribe(results => {
      this.maintenanceMode = <boolean>results[0];
      this.loading = false;
    });
  }

  /** Toggle maintenance mode */
  toggleMaintenanceMode(): void {
    this.dataService.setMaintenanceMode(!this.maintenanceMode).subscribe(() => {
      this.loadData();
    });
  }

  /** Get the message color */
  getMessageColor(): string {
    return this.maintenanceMode ? '#FF1744' : '#00E676';
  }

  /** Get the message color */
  getMessage(): string {
    if (this.maintenanceMode) {
      return 'Current state: shop-db is in maintenance mode';
    }
    return 'Current state: shop-db is online';
  }

}
