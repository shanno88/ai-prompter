import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    subscription: subscriptionReducer
  }
});