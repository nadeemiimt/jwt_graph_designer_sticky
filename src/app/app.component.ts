import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VERSION } from '@angular/material/core';
import * as menu from "./resources/app-menu.json";
import { NavItem } from './model/nav-item';
import { NavService } from './services/nav.service';
import { TokenStorageService } from './services/token-storage.service';
import { Globals } from './globals';
import { select, Store } from '@ngrx/store';
//import { currentUser, UserState } from './store/reducer/user.reducer';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { loginSuccess, logoutSuccess } from './store/action/shared.actions';
import { currentUser } from './store/selector/user.selectors';
import { UserState } from './store/reducer/user.reducer';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('appDrawer') appDrawer?: ElementRef;
  title = 'MyLearning';
  version = VERSION;
  navItems: NavItem[] = [];

  userRoles: string[] = [];
  private readonly ngUnsubscribe = new Subject<void>();

  constructor(private navService: NavService, private tokenStorageService: TokenStorageService, private globals: Globals, private readonly store: Store<UserState>, private _actions$: Actions,) {
    var obj = JSON.parse(JSON.stringify(menu));
    var res = [];

    for (var i in obj) {
      for (var j in obj[i]) {
        res.push(obj[i][j] as NavItem);
      }
      break;
    }

    this.navItems = res;
  }
  ngOnInit(): void {
    if (this.globals.useTokenService) {
      this.tokenStorageService.userRoles.subscribe(val => this.userRoles = val);
    }
    else {
      this._actions$.pipe(ofType(loginSuccess), takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
        console.log('menu login', data);
        if (data) {
          this.userRoles = data.loggedIn.user.roles;
        }
        else {
          this.userRoles = this.globals.defaultRole;
        }

      })

      this._actions$.pipe(ofType(logoutSuccess), takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
        console.log('menu logout', data); // returned state data

        this.userRoles = this.globals.defaultRole;

      })
      this.store.pipe(select(currentUser), takeUntil(this.ngUnsubscribe)).subscribe(userLogin => {
        console.log('menu', userLogin);
        if (userLogin) {
          this.userRoles = userLogin.user.roles;
        }
        else {
          window.sessionStorage.removeItem(TOKEN_KEY);
          this.userRoles = this.globals.defaultRole;
        }
      });
    }
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  getMenu(): string {
    return menu as any as string;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
