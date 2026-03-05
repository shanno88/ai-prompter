import { getUserData, saveUserData } from './paddleUserStore.js';

export const TELEPROMPTER_TRIAL_DAYS = 7;

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetweenFloor(now, future) {
  const ms = new Date(future).getTime() - new Date(now).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function isDateInFuture(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);
  return !Number.isNaN(d.getTime()) && d.getTime() > Date.now();
}

export async function getTeleprompterStatus({ userId, email, paddleCustomerId } = {}) {
  const base = {
    app: 'teleprompter',
    status: 'none',
    isActive: false,
    isTrial: false,
    trialDaysLeft: 0,
    trialEndsAt: null,
    planName: null,
    productId: null,
    subscriptionId: null,
    renewAt: null,
    gracePeriodEndsAt: null,
    remainingQuota: {
      scripts: null,
      characters: null,
    },
  };

  if (!userId && !email && !paddleCustomerId) return base;

  const key = userId || email || paddleCustomerId;
  const user = getUserData(key) || {};

  const tp = user.teleprompter || {};

  // Paid subscription (teleprompter-specific)
  const paidActive = tp.isPro && isDateInFuture(tp.subscriptionEnd);
  if (paidActive) {
    return {
      ...base,
      status: 'active',
      isActive: true,
      isTrial: false,
      trialDaysLeft: 0,
      trialEndsAt: null,
      planName: tp.planName || tp.planType || null,
      productId: tp.productId || null,
      subscriptionId: tp.subscriptionId || null,
      renewAt: tp.subscriptionEnd || null,
      gracePeriodEndsAt: tp.gracePeriodEndsAt || null,
    };
  }

  // Trial
  if (!tp.trialStartedAt) {
    const trialStartedAt = new Date().toISOString();
    const trialDays = TELEPROMPTER_TRIAL_DAYS;

    const next = {
      ...user,
      teleprompter: {
        ...tp,
        trialStartedAt,
        trialDays,
      },
    };

    saveUserData(key, next);

    const trialEndsAt = addDays(trialStartedAt, trialDays).toISOString();
    const trialDaysLeft = Math.max(0, daysBetweenFloor(new Date(), trialEndsAt));

    return {
      ...base,
      status: trialDaysLeft > 0 ? 'trialing' : 'expired',
      isActive: trialDaysLeft > 0,
      isTrial: trialDaysLeft > 0,
      trialDaysLeft,
      trialEndsAt,
    };
  }

  const trialEndsAt = addDays(tp.trialStartedAt, tp.trialDays || TELEPROMPTER_TRIAL_DAYS).toISOString();
  const trialDaysLeft = Math.max(0, daysBetweenFloor(new Date(), trialEndsAt));

  if (trialDaysLeft > 0) {
    return {
      ...base,
      status: 'trialing',
      isActive: true,
      isTrial: true,
      trialDaysLeft,
      trialEndsAt,
    };
  }

  return {
    ...base,
    status: 'expired',
    isActive: false,
    isTrial: false,
    trialDaysLeft: 0,
    trialEndsAt,
  };
}
