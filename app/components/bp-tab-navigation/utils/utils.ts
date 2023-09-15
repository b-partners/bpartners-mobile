export const BOTTOM_TAB_ROUTES: string[] = ['account', 'activity', 'payment', 'facturation', 'service'];

export type IconProps = {
  account: string;
  activity: string;
  payment: string;
  facturation: string;
  service: string;
};

export type IconRouteProps = {
  account: () => void;
  activity: () => void;
  payment: () => void;
  facturation: () => void;
  service: () => void;
};

export const hasBusinessActivities = accountHolder =>
  accountHolder != null &&
  accountHolder.businessActivities != null &&
  (accountHolder.businessActivities.primary != null || accountHolder.businessActivities.secondary != null);
export const hasCarreleur = businessActivities =>
  businessActivities != null &&
  (businessActivities.primary === 'Carreleur' ||
    businessActivities.primary === 'Antinuisibles 3D' ||
    businessActivities.secondary === 'Carreleur' ||
    businessActivities.secondary === 'Antinuisibles 3D');
