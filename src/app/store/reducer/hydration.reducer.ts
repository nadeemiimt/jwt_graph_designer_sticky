import { ActionReducer, INIT, Action } from "@ngrx/store";
import { AppState } from "..";
//import { AppState } from "..";
//import * as HydrationActions from "../action/hydration.actions";
import { UserState } from "./user.reducer";

// https://nils-mehlhorn.de/posts/ngrx-keep-state-refresh
export const hydrationMetaReducer = (
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const storageValue = localStorage.getItem("state");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("state");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};

// function isHydrateSuccess(
//   action: Action
// ): action is ReturnType<typeof HydrationActions.hydrateSuccess> {
//   return action.type === HydrationActions.hydrateSuccess.type;
// }

// export const hydrationMetaReducer = (
//   reducer: ActionReducer<AppState>
// ): ActionReducer<AppState> => {
//   return (state, action) => {
//     if (isHydrateSuccess(action)) {
//       return action.state;
//     } else {
//       return reducer(state, action);
//     }
//   };
// };