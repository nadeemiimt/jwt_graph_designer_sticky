import { Action, createAction, props } from '@ngrx/store';

export enum PaymentActionTypes {
    Success = "[Toastr Notification] Display Success",
    Error = "[Toastr Notification] Display Error",
    Warning = "[Toastr Notification] Display Warning"
  }

export const displaySuccess = createAction(
    PaymentActionTypes.Success,
    props<{ title: string; description: string }>()
  );
  export const displayWarning = createAction(
    PaymentActionTypes.Warning,
    props<{ title: string; description: string }>()
  );
  export const displayError = createAction(
    PaymentActionTypes.Error,
    props<{ title: string; description: string }>()
  );