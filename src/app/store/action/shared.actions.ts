import { Action, createAction, props } from '@ngrx/store';
import { ActionTypes } from 'src/app/model/action-type';
import { User } from 'src/app/model/user';
import { UserLogin } from 'src/app/model/user-login';
// import {IPaymentDetails} from '../model/i-payment-details';
// import {IPaymentQuery} from '../model/i-payment-query';

export const register = createAction(ActionTypes.Register,  props<{user: User}>());
export const registerSuccess = createAction(ActionTypes.RegisterSuccess,  props<{user: User, message: string}>());
export const registerError = createAction(ActionTypes.RegisterError,  props<{ error: string}>());
export const login = createAction(ActionTypes.Login,  props<{loggedIn: UserLogin}>());
export const loginSuccess = createAction(ActionTypes.LoginSuccess,  props<{loggedIn: UserLogin, message: string}>());
export const loginError = createAction(ActionTypes.LoginError,  props<{ error: string}>());
export const getLoggedInUser = createAction(ActionTypes.GetLoggedInUser,  props<{loggedIn: UserLogin}>());
export const logout = createAction(ActionTypes.Logout,  props<{loggedIn: UserLogin}>());
export const logoutSuccess = createAction(ActionTypes.LogoutSuccess,  props<{message: string}>());