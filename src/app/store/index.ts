import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import { hydrationMetaReducer } from "./reducer/hydration.reducer";
import { userReducer, UserState } from "./reducer/user.reducer";
  
  
  export interface AppState {
  user: UserState
  }
  
  export const reducers: ActionReducerMap<AppState> = {
    user: userReducer
  };
  
  
   export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [hydrationMetaReducer] : [hydrationMetaReducer];
  