import env from '../config/env';
import { storage } from '../utils/storage';
import { userSubscriptionApi } from './api';

const getStripeRedirectionUrl = async () => {
  const userId = await storage.loadUserId();
  return {
    failureUrl: new URL(`${env.dashboardUrl}?stripeStatus=error`).href,
    successUrl: new URL(`${env.dashboardUrl}/account/${userId}?stripeStatus=done`).href,
  };
};

export const userSubscriptionProvider = {
  async init() {
    const userId = await storage.loadUserId();
    const userSubscriptionApiValue = await userSubscriptionApi();
    const { data } = await userSubscriptionApiValue.initiateUserSubscription(userId, {
      redirectionStatusUrls: await getStripeRedirectionUrl(),
      subscriptionType: 'ESSENTIAL',
    });
    return data;
  },
  async cancelRenew() {
    const userId = await storage.loadUserId();
    const { cancelUserSubscription } = await userSubscriptionApi();
    const { data } = await cancelUserSubscription(userId);
    return data;
  },
};
