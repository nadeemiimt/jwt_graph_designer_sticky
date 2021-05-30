import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { Globals } from '../globals';
import { UserLogin } from '../model/user-login';
import { AuthService } from '../services/auth-service';
import { TokenStorageService } from '../services/token-storage.service';
import { login, loginError, loginSuccess, logout, logoutSuccess } from '../store/action/shared.actions';
import { UserState } from '../store/reducer/user.reducer';
import { currentUser } from '../store/selector/user.selectors';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  sub: any;
  currentUser: any;

  private readonly ngUnsubscribe = new Subject<void>();

  useTokenService: boolean = true;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, public router: Router, private route: ActivatedRoute, private _actions$: Actions,
    private readonly store: Store<UserState>, private globals: Globals) {
    this.useTokenService = globals.useTokenService;
  }

  ngOnInit(): void {
    this.sub = this.route
      .data
      .subscribe(v => {
        if (v.action === 'logout') {
          this.clear();
          this.logout();
        }
      });

    if (!this.useTokenService) {
      this.store.pipe(select(currentUser), takeLast(1)).subscribe(userLogin => {
        if (userLogin) {
          this.isLoggedIn = true;
          this.roles = userLogin.user.roles;
          this.currentUser = userLogin.user;
        }
      });
    }
    else {
      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles?.join();
      }
    }
  }

  username = new FormControl('', [
    Validators.required
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  form: FormGroup = new FormGroup({
    username: this.username,
    password: this.password
  });
  // });
  matcher = new MyErrorStateMatcher();

  onSubmit() {
    const { username, password } = this.form.value;
    if (this.useTokenService) {
      this.authService.login(username, password).subscribe(
        data => {
          this.tokenStorage.saveToken(data.access_token);
          this.tokenStorage.saveUser(data.user);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.router.navigate(['home']);
          // this.reloadPage();
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
    else {
      let userLogin: UserLogin = {
        access_token: "",
        user: {
          password: password,
          username: username,
          id: "",
          name: "",
          roles: []
        }
      }
      this.store.dispatch(login({ loggedIn: userLogin }));

      this._actions$.pipe(ofType(loginSuccess)).subscribe((data: any) => {
        console.log("success login", data); // returned state data

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = data.loggedIn.user.roles;
        this.router.navigate(['home']);

      })

      this._actions$.pipe(ofType(loginError)).subscribe((data: any) => {
        console.log("Error login", data);
        this.errorMessage = data.error;
        this.isLoginFailed = true;
      })

    }

  }

  reloadPage(): void {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  //@Input() 

  error!: string | null;

  //@Output() submitEM = new EventEmitter();
  clear() {
    this.form.setValue({ "username": "", "password": "" });
  }

  logout() {
    if (this.useTokenService) {
      this.tokenStorage.signOut();
      //this.router.navigate(['login']);
      this.reloadComponent();
    }
    else {
      this.store.dispatch(logout({ loggedIn: this.currentUser }));

      this._actions$.pipe(ofType(logoutSuccess)).subscribe((data: any) => {
        console.log("success logout", data); // returned state data
        this.router.navigate(['home']);
      })
    }

  }

  reloadComponent() {
    this.router.navigateByUrl('home', { skipLocationChange: true }).then(() => {
      this.reloadPage();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
