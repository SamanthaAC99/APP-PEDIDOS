import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userSlice from '../features/auth/userSlice.js';
import menuSlice from '../features/menu/menuSlice.js';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
const reducers = combineReducers({
  auth:userSlice,
  menu: menuSlice,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)
export  const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})


export const persistor = persistStore(store)