import { configureStore } from "@reduxjs/toolkit";
import repoReducer from './slice/repoSlice'
export const store = configureStore({
  reducer: {
  repo:repoReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
