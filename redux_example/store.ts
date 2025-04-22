// store.ts
import { configureStore } from '@reduxjs/toolkit';
import pageEditorReducer from './features/pageEditor/pageEditorSlice';

export const store = configureStore({
  reducer: {
    pageEditor: pageEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;