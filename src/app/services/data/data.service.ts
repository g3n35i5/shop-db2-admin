import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  constructor(public http: HttpClient) { }

  public login(id: number, password: string) {
    const data = {id: id, password: password};
    return this.postData('login', data);
  }

  public getUsers() {
    return this.getData('users');
  }

  public getUser(id: number) {
    return this.getData('users/' + id.toString());
  }

  public updateUser(id: number, data: any) {
    return this.putData('users/' + id.toString(), data);
  }

  public createUser(data: any) {
    return this.postData('register', data);
  }

  public deleteUser(id: number) {
    return this.deleteData('users/' + id.toString());
  }

  public verifyUser(id: number, rankID: number) {
    const data = {rank_id: rankID};
    return this.postData('verify/' + id.toString(), data);
  }

  public getPurchases() {
    return this.getData('purchases');
  }

  public togglePurchaseRevoke(id: number, data: any) {
    return this.putData('purchases/' + id.toString(), data);
  }

  public getDeposits() {
    return this.getData('deposits');
  }

  public toggleDepositRevoke(id: number, data: any) {
    return this.putData('deposits/' + id.toString(), data);
  }

  public createDeposit(data: any) {
    return this.postData('deposits', data);
  }

  public getProducts() {
    return this.getData('products');
  }

  public getProduct(id: number) {
    return this.getData('products/' + id.toString());
  }

  public updateProduct(id: number, data: any) {
    return this.putData('products/' + id.toString(), data);
  }

  public getPendingVerifications() {
    return this.getData('verifications');
  }

  public getRanks() {
    return this.getData('ranks');
  }

  public upload(data) {
    return this.postData('upload', data);
  }

  public backendOnline() {
    return this.getData('');
  }

  private getData(route) {
    return this.makeRequest(route, null, 'GET');
  }

  private postData(route, data) {
    return this.makeRequest(route, data, 'POST');
  }

  private putData(route, data) {
    return this.makeRequest(route, data, 'PUT');
  }

  private deleteData(route) {
    return this.makeRequest(route, null, 'DELETE');
  }

  private makeRequest(route, data, type) {
    /** Check if the backend is available. If this is not the case,
        the HTTP_INTERCEPTOR will redirect you to the offline page
        and cancel the request. */
    this.http.get('/api/');
    /** Get the access token from the local storage. */
    let token = localStorage.getItem('token');
    /** If the token does not exist, replace it with an empty string. */
    if (typeof token === 'undefined' || token === null) {
      token = '';
    }
    /** Define the request header with the access token. */
    let header = {
      token: token
    }
    /** Switch case for the different request methods. */
    if (type === 'GET') {
      return this.http.get('/api/' + route, { headers: header });
    } else if (type === 'POST') {
      return this.http.post('/api/' + route, data, { headers: header });
    } else if (type === 'PUT') {
      return this.http.put('/api/' + route, data, { headers: header });
    } else if (type === 'DELETE') {
      return this.http.delete('/api/' + route, { headers: header });
    } else {
      console.log('DataService: Invalid request type: ' + type);
    }
  }
}
