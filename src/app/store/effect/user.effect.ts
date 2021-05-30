import { Injectable } from '@angular/core';
import { register, registerSuccess, loginSuccess, registerError, login, loginError, logoutSuccess, logout } from '../action/shared.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth-service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { displayError, displaySuccess } from '../action/notification.action';
import { UserState } from '../reducer/user.reducer';

const TOKEN_KEY = 'access_token';

@Injectable()
export class SharedEffects {

    registerUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(register),
            switchMap(action => this.authService.register(action.user)
                .pipe(
                    map(usr => (registerSuccess({ user: usr, message: action.user.name + " registered successfully" }))),
                    catchError(e => of(registerError({ error: action.user.name + ` registration failed` }))))
            )
        )
    );

    registerSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(registerSuccess),
        map(action => {
            return displaySuccess({
                title: "Register Success",
                description: action.message,
            });
        }
        )
    )
    );

    registerError$ = createEffect(() => this.actions$.pipe(
        ofType(registerError),
        map(action => {
            return displayError({
                title: "Registration Failed",
                description: action.error,
            });
        }
        )
    )
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            switchMap(action => this.authService.login(action.loggedIn.user.username, action.loggedIn.user.password)
                .pipe(
                    map(usr => (loginSuccess({ loggedIn: usr, message: usr.user.username + " login successful" }))),
                    catchError(e => of(loginError({ error: action.loggedIn.user.username + " login failed" }))))
            )
        )
    );

    loginSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        map(action => {
            window.sessionStorage.setItem(TOKEN_KEY, action.loggedIn.access_token);
            return displaySuccess({
                title: "Login Success",
                description: action.message,
            });
        }
        )
    )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            map(action => {
                return logoutSuccess({
                    message: "Logout success"
                });
            }
            )
        )
    );

    logoutSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(logoutSuccess),
        map(action => {
            window.sessionStorage.removeItem(TOKEN_KEY);
            return displaySuccess({
                title: "Logout Success",
                description: action.message,
            });
        }
        )
    )
    );

    loginError$ = createEffect(() => this.actions$.pipe(
        ofType(loginError),
        map(action => {
            return displayError({
                title: "Login Failed",
                description: action.error,
            });
        }
        )
    )
    );

    constructor(private actions$: Actions, private authService: AuthService, private store: Store<UserState>,) { }

}

