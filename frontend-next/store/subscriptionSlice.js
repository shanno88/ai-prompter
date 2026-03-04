import { createSlice } from '@reduxjs/toolkit';

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    isPro: false,
    planType: null, // 'monthly' | 'yearly' | null
    subscriptionEnd: null,
    trialEnd: null,
    dailyCreditsUsed: 0,
    dailyCreditsLimit: 10,
    isLoading: false,
    error: null
  },
  reducers: {
    setSubscriptionStatus: (state, action) => {
      const { isPro, planType, subscriptionEnd, trialEnd, dailyCreditsUsed, dailyCreditsLimit } = action.payload;
      state.isPro = isPro;
      state.planType = planType;
      state.subscriptionEnd = subscriptionEnd;
      state.trialEnd = trialEnd;
      state.dailyCreditsUsed = dailyCreditsUsed || 0;
      state.dailyCreditsLimit = dailyCreditsLimit || (isPro ? Infinity : 10);
      state.error = null;
    },
    incrementCreditsUsed: (state) => {
      if (!state.isPro) {
        state.dailyCreditsUsed++;
      }
    },
    resetDailyCredits: (state) => {
      state.dailyCreditsUsed = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setSubscriptionStatus,
  incrementCreditsUsed,
  resetDailyCredits,
  setLoading,
  setError
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
