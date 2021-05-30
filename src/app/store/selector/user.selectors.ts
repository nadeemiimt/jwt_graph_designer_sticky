import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromUser from '../reducer/user.reducer';

export const selectPaymentState = createFeatureSelector<fromUser.UserState>(
  fromUser.userFeatureKey,
);


export const currentUser = createSelector(
  selectPaymentState,
  (state: fromUser.UserState) => state?.loggedIn
);

export const getAccessToken = createSelector(
  selectPaymentState,
  (state: fromUser.UserState) => state?.loggedIn ? state.loggedIn.access_token : ''
);


// export const currentUser = (state: UserState) => state.loggedIn;

// export const getAccessToken = (state: UserState) => state.loggedIn ? state.loggedIn.access_token : '';

// export const getError = (state: UserState) => state.error;

// export const getSuccess = (state: UserState) => state.message;

// export const selectLoggedInUser = createFeatureSelector<UserState>('loggedInData');