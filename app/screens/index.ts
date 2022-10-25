import { TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../theme';

export * from './welcome/welcome-screen';
export * from './transaction/transaction-list-screen';
export * from './error/error-boundary';
export * from './sign-in/sign-in-screen';
export * from './onboarding/onboarding-screen';
export * from './payment-initiation/payment-initiation-screen';
export * from './profile/profile-screen';
export * from './home/home-screen';
export { TRANSACTION_BUTTONS_STYLE } from './home/styles';
export { FOOTER_STYLE } from './home/styles';
export { BALANCE_TEXT_STYLE } from './home/styles';
export { CHART_BUTTON_MARGIN_STYLE } from './home/styles';
export { CHART_BUTTON_STYLE } from './home/styles';
export { CHART_BUTTON_CONTAINER_STYLE } from './home/styles';
export { BUTTON_CONTAINER_STYLE } from './home/styles';
export { BALANCE_CONTAINER_STYLE } from './home/styles';
export { BALANCE_STYLE } from './home/styles';
export { BULLET_BUTTON } from './home/styles';
export { BULLET_BUTTON_STYLE } from './home/styles';
export { BUTTON_STYLE_NO_MARGIN_STYLE } from './home/styles';
export { BUTTON_STYLE } from './home/styles';
export { BUTTON_TEXT_STYLE } from './home/styles';
export { HEADER_STYLE } from './home/styles';
export { LOGO_STYLE } from './home/styles';
export { Balance } from './home/components/balance';
export { HomeHeader } from './home/components/home-header';
export { HomeNavbar } from './home/components/home-navbar';
export { TransactionSummary } from './home/components/transaction-summary';
export { HomeLatestTransaction } from './home/components/home-latest-transaction';
export { HomeFooter } from './home/components/home-footer';

export const FULL: ViewStyle = {
  flex: 1,
};
export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
export const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
export const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
