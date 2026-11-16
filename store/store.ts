import { configureStore } from "@reduxjs/toolkit";
import repoReducer from './slice/repoSlice';
import reviewReducer from './slice/reviewSlice'
export const store = configureStore({
  reducer: {
  repo:repoReducer,
  review:reviewReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
