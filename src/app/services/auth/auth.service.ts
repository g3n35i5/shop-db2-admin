import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../data/data.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private dataService: DataService,
    private jwtHelper: JwtHelperService
  ) {}

  private loggedIn = new BehaviorSubject<boolean>(this.tokenValid());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }


  tokenValid() {
    const token = localStorage.getItem('token');
    if (typeof token === 'undefined' || token === null) { return false; }
    const decoded = this.jwtHelper.decodeToken(token);
    if (typeof decoded === 'undefined' || decoded === null) { return false; }
    const isExpired = this.jwtHelper.isTokenExpired(token);
    return !isExpired;
  }

  login(user) {
    if (user.id !== '' && user.password !== '' ) {
      this.dataService.login(user.id, user.password)
      .subscribe(result => {
        const token = result['token'];
        if (typeof token === 'undefined' || token === null) {
          this.loggedIn.next(false);
          this.router.navigate(['/login']);
        } else {
          localStorage.setItem('token', token);
          const currentUser = this.jwtHelper.decodeToken(token).user;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        if (this.tokenValid()) {
          this.loggedIn.next(true);
          this.router.navigate(['/']);
        } else {
          this.loggedIn.next(false);
          this.router.navigate(['/login']);
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
