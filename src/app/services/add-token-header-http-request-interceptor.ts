import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { EMPTY, Observable, of } from "rxjs";
import { first, mergeMap } from "rxjs/operators";
import { Globals } from "../globals";
import { UserState } from "../store/reducer/user.reducer";
import { getAccessToken } from "../store/selector/user.selectors";
import { TokenStorageService } from "./token-storage.service";


const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable({
    providedIn: 'root'
  })
export class AddTokenHeaderHttpRequestInterceptor implements HttpInterceptor {
    /**
     * Constructor.
     */
    constructor(private store$: Store<UserState>, private token: TokenStorageService, private globals: Globals) { }

    /**
     * Intercepts all HTTP requests and adds the JWT token to the request's header if the URL
     * is a REST endpoint and not login or logout.
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.search('/api/auth/') === -1) {
            if (!this.globals.useTokenService) {
                // Consider only adding the auth header to API requests as this will add it to all HTTP requests.
                return this.addTokenFromStore(request).pipe(
                    first(),
                    mergeMap((requestWithToken: HttpRequest<any>) => next.handle(requestWithToken))
                );
            }
            else {
                const token = this.token.getToken();
                if (token != null) {
                    request = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
                    .set("Content-Type", "application/json") 
                });
                }
                return next.handle(request);
            }
        }
        else {
            return next.handle(request);
        }
    }

    /**
     * Adds the JWT token to the request's header.
     */
    private addTokenFromStore(request: HttpRequest<any>): Observable<HttpRequest<any>> {
        // NOTE: DO NOT try to immediately setup this selector in the constructor or as an assignment in a
        // class member variable as there's no stores available when this interceptor fires fires up and
        // as a result it'll throw a runtime error.
        return this.store$.pipe(
            select(getAccessToken),
            mergeMap((token: string) => {
                if (token) {
                    console.log('user token', token);
                    request = request.clone({
                        headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`)
                        .set("Content-Type", "application/json"),
                        // withCredentials: true
                    });
                } else {
                    console.warn(`Invalid token!!! Cannot use token "${token}".`);
                }
                return of(request);
            })
        );
    }
}