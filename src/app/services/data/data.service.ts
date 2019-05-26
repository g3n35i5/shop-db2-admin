import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmpty(obj[key]);
    } else if (obj[key] == null) {
      delete obj[key];
    }
  });
};

@Injectable()
export class DataService {

  apiURL = environment.apiURL;

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

  public createPurchase(data: any) {
    return this.postData('purchases', data);
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

  public createBatchDeposit(data: any) {
    return this.postData('deposits/batch', data);
  }

  public getProducts() {
    return this.getData('products');
  }

  public getProduct(id: number) {
    return this.getData('products/' + id.toString());
  }

  public getProductPricehistory(id: number) {
    return this.getData('products/' + id.toString() + '/pricehistory');
  }

  public createProduct(data: any) {
    return this.postData('products', data);
  }

  public updateProduct(id: number, data: any) {
    return this.putData('products/' + id.toString(), data);
  }

  public getFinancialOverview() {
    return this.getData('financial_overview');
  }

  public getProducttags() {
    return this.getData('tags');
  }

  public addTagAssignment(productID: number, tagID: number) {
    const data = { product_id: productID, tag_id: tagID };
    return this.postData('tagassignment/add', data);
  }

  public removeTagAssignment(productID: number, tagID: number) {
    const data = { product_id: productID, tag_id: tagID };
    return this.postData('tagassignment/remove', data);
  }

  public getProducttag(id: number) {
    return this.getData('tags/' + id.toString());
  }

  public deleteProducttag(id: number) {
    return this.deleteData('tags/' + id.toString());
  }

  public updateProducttag(id: number, data: any) {
    return this.putData('tags/' + id.toString(), data);
  }

  public createTag(name: string) {
    const data = {name: name};
    return this.postData('tags', data);
  }

  public getPendingVerifications() {
    return this.getData('verifications');
  }

  public getRanks() {
    return this.getData('ranks');
  }

  public getReplenishmentCollections() {
    return this.getData('replenishmentcollections');
  }

  public getReplenishmentCollection(id: number) {
    return this.getData('replenishmentcollections/' + id.toString());
  }

  public createReplenishmentCollection(data: any) {
    return this.postData('replenishmentcollections', data);
  }

  public toggleReplenishmentCollectionRevoke(id: number, data: any) {
    return this.putData('replenishmentcollections/' + id.toString(), data);
  }

  public toggleReplenishmentRevoke(id: number, data: any) {
    return this.putData('replenishments/' + id.toString(), data);
  }

  public getRefunds() {
    return this.getData('refunds');
  }

  public toggleRefundRevoke(id: number, data: any) {
    return this.putData('refunds/' + id.toString(), data);
  }

  public createRefund(data: any) {
    return this.postData('refunds', data);
  }

  public getPayoffs() {
    return this.getData('payoffs');
  }

  public togglePayoffRevoke(id: number, data: any) {
    return this.putData('payoffs/' + id.toString(), data);
  }

  public createPayoff(data: any) {
    return this.postData('payoffs', data);
  }

  public getStocktakingCollections() {
    return this.getData('stocktakingcollections');
  }

  public getStocktakingCollection(id: number) {
    return this.getData('stocktakingcollections/' + id.toString());
  }

  public createStocktakingCollection(data: any) {
    return this.postData('stocktakingcollections/', data);
  }

  public toggleStocktakingCollectionRevoke(id: number, data: any) {
    return this.putData('stocktakingcollections/' + id.toString(), data);
  }

  public updateStocktaking(id: number, data: any) {
    return this.putData('stocktakings/' + id.toString(), data);
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
    this.http.get(this.apiURL);
    /** Get the access token from the local storage. */
    let token = localStorage.getItem('token');
    /** If the token does not exist, replace it with an empty string. */
    if (typeof token === 'undefined' || token === null) {
      token = '';
    }
    /** Define the request header with the access token. */
    const header = {
      token: token
    };

    /** Delete all null or empty values from the data object. **/
    if (data !== null) {
      removeEmpty(data);
    }

    /** Switch case for the different request methods. */
    if (type === 'GET') {
      return this.http.get(this.apiURL + route, { headers: header });
    } else if (type === 'POST') {
      return this.http.post(this.apiURL + route, data, { headers: header });
    } else if (type === 'PUT') {
      return this.http.put(this.apiURL + route, data, { headers: header });
    } else if (type === 'DELETE') {
      return this.http.delete(this.apiURL + route, { headers: header });
    } else {
      console.log('DataService: Invalid request type: ' + type);
    }
  }
}
