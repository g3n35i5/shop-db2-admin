import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})
export class OfflineComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  public loading : boolean = true;

  ngOnInit() {
    this.loading = false;
  }

  /** Returns the text for the retry button depending on the loading
      variable.*/
  buttonText() {
    return this.loading ? 'Loading...' : 'Retry';
  }

  /** Try to connect to the backend.*/
  retry () {
    /** Set the loading variable to true. This disables the button
        and switches the button text.*/
    this.loading = true;
    /** If the backend is online, redirect to the root url.*/
    this.dataService.backendOnline().subscribe(() => {
      this.router.navigate(['/']);
    },
    /** If the backend is still offline, stay on this page.*/
    () => {
      setTimeout(() => {
        this.loading = false;
      }, 1000)
    })
  }
}
