import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService) { }

  public name: string;
  public email: string;
  public avatarColor = '#454545';
  public elements = [
    {
      icon: 'dashboard',
      title: 'Dashboard',
      link: 'dashboard'
    },
    {
      icon: 'group',
      title: 'Users',
      link: 'users'
    },
    {
      icon: 'restaurant',
      title: 'Products',
      link: 'products'
    },
    {
      icon: 'local_offer',
      title: 'Product Tags',
      link: 'producttags'
    },
    {
      icon: 'shopping_basket',
      title: 'Replenishments',
      link: 'replenishments'
    },
    {
      icon: 'shopping_cart',
      title: 'Purchases',
      link: 'purchases'
    },
    {
      icon: 'attach_money',
      title: 'Deposits',
      link: 'deposits'
    },
    {
      icon: 'settings_backup_restore',
      title: 'Refunds',
      link: 'refunds'
    },
    {
      icon: 'euro_symbol',
      title: 'Payoffs',
      link: 'payoffs'
    },
    {
      icon: 'verified_user',
      title: 'Verifications',
      link: 'verifications'
    }
  ];

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    /** Get the current user from the local storage. */
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /** That wasn't supposed to happen. But if it happens, we better
        redirect to the login page again.*/
    if (typeof currentUser === 'undefined' || currentUser === null) {
      this.logout();
    }
    /** Set the email address in order to generate the avatar.*/
    this.name = currentUser.firstname + ' ' + currentUser.lastname;
    this.email = currentUser.email;
  }

  /** Checks for each element of the Navbar whether it is active or not.*/
  isActiveRoute(route) {
    console.log(this.router.url);
    return this.router.url === route.link;
  }

  /** Logout function. */
  logout() {
    this.authService.logout();
  }
}
