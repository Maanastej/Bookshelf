import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import booksReducer from './booksSlice';
import savedReducer from './savedSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    saved: savedReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // AsyncStorage operations are intentionally fire-and-forget side effects
      // inside reducers (via persistSavedBooks). Serializability check is kept
      // on so the rest of the state stays inspectable.
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
