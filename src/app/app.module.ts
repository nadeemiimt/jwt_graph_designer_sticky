import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuardHelperService } from './services/guard-helper-service';
import { RoleGuardService } from './services/role-guard.service';
import { AuthGuardService } from './services/auth-guard.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import {  MatButtonModule } from  '@angular/material/button';
import { MatListModule } from  '@angular/material/list';
import { MatSidenavModule } from  '@angular/material/sidenav';
import {  MatIconModule } from  '@angular/material/icon';
import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { MenuListItemComponent } from './common/menu-list-item/menu-list-item.component';
import { TopNavComponent } from './common/top-nav/top-nav.component';
import { NavService } from './services/nav.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { XhrErrorHandlerService } from './services/xhr-error-handler-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddTokenHeaderHttpRequestInterceptor } from './services/add-token-header-http-request-interceptor';
import { EffectsModule } from '@ngrx/effects';
import { userReducer } from './store/reducer/user.reducer';
import { SharedEffects } from './store/effect/user.effect';
import { NotificationEffects } from './store/effect/notification.effect';
import { CustomSnackbarService } from './services/custom-snackbar.service';
import { Globals } from './globals';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducers, metaReducers } from './store';


@NgModule({
  declarations: [
    AppComponent,
    MenuListItemComponent,
    TopNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    HomeModule,
    AdminModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    StoreModule.forRoot(userReducer),
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forRoot([SharedEffects, NotificationEffects]),
   // StoreModule.forRoot(reducers, { metaReducers }),

    // StoreModule.forRoot(reducers, { metaReducers }),
    // StoreModule.forFeature('user', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    MatSnackBarModule,
  ],
  providers: [
    Globals,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService, GuardHelperService, RoleGuardService, AuthGuardService, NavService, MatSnackBar,
    XhrErrorHandlerService,
   { provide: ErrorHandler, useClass: XhrErrorHandlerService },
    CustomSnackbarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenHeaderHttpRequestInterceptor,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
