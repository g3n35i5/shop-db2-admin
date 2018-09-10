import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AvatarModule } from 'ng2-avatar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OfflineComponent } from './offline/offline.component';
import { UsersComponent } from './users/users.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { DepositsComponent } from './deposits/deposits.component';
import { VerificationsComponent } from './verifications/verifications.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoadingComponent } from './loading/loading.component';
import { InterceptorComponent } from './services/interceptor/interceptor.component';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { SnackbarService } from './services/snackbar/snackbar.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'offline', component: OfflineComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard] },
  { path: 'deposits', component: DepositsComponent, canActivate: [AuthGuard] },
  { path: 'verifications', component: VerificationsComponent, canActivate: [AuthGuard] },
  { path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    OfflineComponent,
    UsersComponent,
    PurchasesComponent,
    DepositsComponent,
    VerificationsComponent,
    PagenotfoundComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({}),
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
  bootstrap: [AppComponent]
})
export class AppModule { }
