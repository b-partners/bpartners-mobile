import { TxKeyPath } from '../../../i18n';

export const bredUrl =
  // eslint-disable-next-line max-len
  'https://www.bred.fr/professionnels-associations/ouvrir-un-compte-pro?utm_medium=referral&utm_source=bpartners.app&utm_campaign=RE_bpartners&utm_content=ban_compte-bancaire';

export const insuranceUrl =
  // eslint-disable-next-line max-len
  'https://www.bred.fr/professionnels-associations/assurance/assurance-des-biens/assurance-multirisque-pro?utm_medium=referral&utm_source=bpartners.app&utm_campaign=RE_bpartners&utm_content=ban_assurance-pro';

export type PartnersCardProps = {
  firstLabel: TxKeyPath;
  secondLabel: TxKeyPath;
  firstText: TxKeyPath;
  secondText: TxKeyPath;
  buttonText: TxKeyPath;
  isInsurance?: boolean;
};
