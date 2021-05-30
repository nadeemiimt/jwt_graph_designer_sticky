import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Globals } from '../globals';
import { GuardHelperService } from './guard-helper-service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: GuardHelperService, public router: Router, private globals: Globals,) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.globals.useTokenService) {
      if (!this.auth.isAuthenticated()) {
        this.router.navigate(['login']);
        return of(false);
      }
      return of(true);
    }
    else {
      return this.auth.isAuthenticatedAsyn().pipe(
        take(1),
        map(res => {
        if (res && res.isAuhtenticated) {
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