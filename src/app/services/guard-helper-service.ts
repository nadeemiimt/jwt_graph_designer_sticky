import { Injectable, SkipSelf } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { select, State } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, takeLast, tap } from 'rxjs/operators';
import { Globals } from '../globals';
import { AuthenticationGuard } from '../model/authentication-guard.model';
//import { AppState } from '../store';
import { UserState } from '../store/reducer/user.reducer';
import { currentUser } from '../store/selector/user.selectors';
//import { selectLoggedInUserState } from '../store';
//import { currentUser, UserState } from '../store/reducer/user.reducer';
const TOKEN_KEY = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class GuardHelperService {
  constructor(public jwtHelper: JwtHelperService,private readonly state: State<UserState>) { }
  // ...
  public isAuthenticatedAsyn(): Observable<AuthenticationGuard> {
    console.log('token validate called');

      return this.state.pipe(select(currentUser)).pipe(
        map(loggedIn => {
          console.log('token validate', loggedIn);
        //const token = loggedIn?.access_token;
        const token = window.sessionStorage.getItem(TOKEN_KEY) ?? "";
        console.log('token', token);
        const isValid = !this.jwtHelper.isTokenExpired(token);
        let result: AuthenticationGuard = {
          accessToken : token,
          isAuhtenticated: isValid
        };
        return result;
      }));
  }

  public isAuthenticated(): boolean {
    const token = window.sessionStorage.getItem(TOKEN_KEY) ?? "";
      // Check whether the token is expired and return
      // true or false
      return !this.jwtHelper.isTokenExpired(token);
  }
}