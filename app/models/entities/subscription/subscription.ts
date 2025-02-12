import { UserSubscriptionStatus } from "@bpartners/typescript-client";
import { types } from "mobx-state-tree";

export const SubscriptionModel = types.model('Subscription').props({
  status: types.maybeNull(types.enumeration(Object.values(UserSubscriptionStatus))),
  start: types.maybeNull(types.string),
  end: types.maybeNull(types.string),
});

