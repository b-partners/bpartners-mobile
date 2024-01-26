import { translate } from '../../../i18n';

export const productFormSchema = {
  unitPrice: {
    required: translate('errors.required'),
    pattern: {
      value: /^[0-9]+(?:[.,][0-9]+)?$/,
      message: translate('errors.invalidPrice'),
    },
  },
  description: {
    required: translate('errors.required'),
  },
  vatPercent: {
    required: translate('errors.required'),
    pattern: {
      value: /^[0-9]+(?:[.,][0-9]+)?$/,
      message: translate('errors.invalidPercent'),
    },
  },
};
