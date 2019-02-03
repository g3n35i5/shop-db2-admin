import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AvatarModule } from 'ng2-avatar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { CustomCurrency } from './filters';
import { CustomTimestamp } from './filters';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OfflineComponent } from './offline/offline.component';
import { UsersComponent } from './users/users.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { DepositsComponent } from './deposits/deposits.component';
import { CreateDepositComponent } from './deposits/create-deposit/create-deposit.component';
import { VerificationsComponent } from './verifications/verifications.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoadingComponent } from './loading/loading.component';
import { InterceptorComponent } from './services/interceptor/interceptor.component';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ProductsComponent } from './products/products.component';
import { ProductinfoComponent } from './products/productinfo/productinfo.component';
import { PricehistoryComponent } from './pricehistory/pricehistory.component';
import { EditproductComponent } from './products/editproduct/editproduct.component';
import { ReplenishmentsComponent } from './replenishments/replenishments.component';
import { ProducttagsComponent } from './producttags/producttags.component';
import { EditTagComponent } from './producttags/edittag/edittag.component';
import { CreateTagComponent } from './producttags/createtag/createtag.component';
import { CreateProductComponent } from './products/createproduct/createproduct.component';
import { CreateReplenishmentComponent } from './replenishments/createreplenishment/createreplenishment.component';
import { ReplenishmentcollectioninfoComponent } from './replenishments/replenishmentcollectioninfo/replenishmentcollectioninfo.component';
import { RefundsComponent } from './refunds/refunds.component';
import { CreateRefundComponent } from './refunds/create-refund/create-refund.component';
import { PayoffsComponent } from './payoffs/payoffs.component';
import { CreatePayoffComponent } from './payoffs/create-payoff/create-payoff.component';
import {OverlayContainer} from '@angular/cdk/overlay';

/** Returns the token from the local storage. Required for the JWT tool. */
export function tokenGetter() {
  return localStorage.getItem('token');
}

/** Contains all app routes. */
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'offline', component: OfflineComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'producttags', component: ProducttagsComponent, canActivate: [AuthGuard] },
  { path: 'replenishments', component: ReplenishmentsComponent, canActivate: [AuthGuard] },
  { path: 'pricehistory/:id', component: PricehistoryComponent, canActivate: [AuthGuard] },
  { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard] },
  { path: 'deposits', component: DepositsComponent, canActivate: [AuthGuard] },
  { path: 'refunds', component: RefundsComponent, canActivate: [AuthGuard] },
  { path: 'payoffs', component: PayoffsComponent, canActivate: [AuthGuard] },
  { path: 'verifications', component: VerificationsComponent, canActivate: [AuthGuard] },
  { path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  declarations: [
    CustomCurrency,
    CustomTimestamp,
    AppComponent,
    DashboardComponent,
    LoginComponent,
    OfflineComponent,
    UsersComponent,
    PurchasesComponent,
    DepositsComponent,
    CreateDepositComponent,
    VerificationsComponent,
    PagenotfoundComponent,
    LoadingComponent,
    EditUserComponent,
    ProductsComponent,
    ProductinfoComponent,
    PricehistoryComponent,
    EditproductComponent,
    ReplenishmentsComponent,
    ProducttagsComponent,
    EditTagComponent,
    CreateTagComponent,
    CreateProductComponent,
    CreateReplenishmentComponent,
    ReplenishmentcollectioninfoComponent,
    RefundsComponent,
    CreateRefundComponent,
    PayoffsComponent,
    CreatePayoffComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    AvatarModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard,
    DataService,
    SnackbarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorComponent,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditUserComponent,
    CreateDepositComponent,
    ProductinfoComponent,
    EditproductComponent,
    CreateTagComponent,
    EditTagComponent,
    CreateProductComponent,
    CreateReplenishmentComponent,
    ReplenishmentcollectioninfoComponent,
    CreateRefundComponent,
    CreatePayoffComponent,
  ]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }
}
