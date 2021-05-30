import { createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import { User } from 'src/app/model/user';
import { UserLogin } from 'src/app/model/user-login';
import { getLoggedInUser, login, loginError, loginSuccess, logout, logoutSuccess, register, registerError, registerSuccess } from '../action/shared.actions';


export const userFeatureKey = 'user';

export interface UserState {
  users: User[];
  loggedIn: UserLogin;
  error: string;
  message: string;
}
const defaultUser: User = {
  id: "",
  name: "",
  password: "",
  roles: ["anonymous"],
  username: ""
};

const defaultLogin: UserLogin = {
  access_token: "",
  user: defaultUser
};

export const initialState: UserState = {
  users: [],
  loggedIn: defaultLogin,
  error: '',
  message: ''
};

export const userReducer = createReducer(
  initialState,
  on(register, (state, {user}) => ({ ...state, users: state.users, error: '', loggedIn: state.loggedIn, message: '' })),
  on(registerSuccess, (state, {user, message}) => ({ ...state, users: state.users ? state.users.concat(user) : [user], error: '', loggedIn: defaultLogin, message: message })),
  on(registerError, (state, {error}) => ({ ...state, users: state.users, error: error, loggedIn: defaultLogin, message: '' })),
  on(login, (state, {loggedIn}) => ({ ...state, users: state.users, error: '', loggedIn: defaultLogin, message: '' })),
  on(loginSuccess, (state, {loggedIn, message}) => ({ ...state, users: state.users, error: '', loggedIn: loggedIn, message: message })),
  on(loginError, (state, {error}) => ({ ...state, users: state.users, error: error, loggedIn: defaultLogin, message: '' })),
  on(getLoggedInUser, (state) => ({ ...state, loggedIn: state.loggedIn})),
  on(logout, (state) => ({ ...state, loggedIn: state.loggedIn, error: '', message: '' })),
  on(logoutSuccess, (state, {message}) => ({ ...state, loggedIn: state.loggedIn, message: message })),
);

// unique()

// export const currentUser = (state: UserState) => state.loggedIn;

// export const getAccessToken = (state: UserState) => state.loggedIn ? state.loggedIn.access_token : '';

// export const getError = (state: UserState) => state.error;

// export const getSuccess = (state: UserState) => state.message;

// export const selectLoggedInUser = createFeatureSelector<UserState>('loggedInData');

// export const selectLoggedInUserState = createSelector(
//    selectLoggedInUser,
//    (state: UserState) => state.loggedIn
//  );

