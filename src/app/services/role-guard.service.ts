import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { GuardHelperService } from './guard-helper-service';
import decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { Globals } from '../globals';
import { map, take } from 'rxjs/operators';
const TOKEN_KEY = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(public auth: GuardHelperService, public router: Router, private globals: Globals,) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;

    if (this.globals.useTokenService) {
      const token = window.sessionStorage.getItem(TOKEN_KEY) ?? "";
      // decode the token to get its payload
      const tokenPayload: any = decode(token);
      if (
        !this.auth.isAuthenticated() ||
        !tokenPayload.roles.includes(expectedRole)
      ) {
        this.router.navigate(['login']);
        return of(false);
      }
      return of(true);
    }
    else {
      console.log('token role guard validate called');
      return this.auth.isAuthenticatedAsyn().pipe(
        take(1),
        map(res => {
          if (res && res.isAuhtenticated) {
            // decode the token to get its payload
            const tokenPayload: any = decode((res.accessToken ?? ""));
            if (
              !tokenPayload.roles.includes(expectedRole)
            ) {
              this.router.navigate(['login']);
              return false;
            }
            return true;
          }
          else {
            this.router.navigate(['login']);
            return false;
          }
        }));
    }

  }
}