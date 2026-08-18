import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice.js';
import authReducer from './slices/authSlice.js';
import { injectStore } from '@/services/api';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    // notificationSlice etc. is added as that module is built
  },
});

injectStore(store);
