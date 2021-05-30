import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { CustomSnackbarService } from "src/app/services/custom-snackbar.service";
import { displaySuccess, displayWarning, displayError } from "../action/notification.action";

@Injectable()
export class NotificationEffects {
    displaySuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(displaySuccess),
                map(action => {
                    this.notification.open(action.description,'success');
                })
            ),
        { dispatch: false }
    );

    displayWarning$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(displayWarning),
                map(action => {
                    this.notification.notify(action.description,'warning');
                })
            ),
        { dispatch: false }
    );

    displayError$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(displayError),
                map(action => {
                    this.notification.open(action.description,'error');
                })
            ),
        { dispatch: false }
    );

    constructor(private actions$: Actions, private notification: CustomSnackbarService) { }
}