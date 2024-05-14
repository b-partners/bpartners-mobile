import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { translate } from '../../../i18n';
import { getPolygonName } from './utils';

const annotatorInfoResolver = yup.object({
  labelName: yup.string().required(translate('errors.required')),
  labelType: yup
    .object()
    .shape({
      label: yup.string().required(translate('errors.required')),
      value: yup.string().required(translate('errors.required')),
    })
    .required(translate('errors.required')),
});

export const getAnnotatorResolver = () => {
  return yupResolver(annotatorInfoResolver);
};

export const getDefaultValue = polygonLength => {
  return {
    labelName: getPolygonName(polygonLength),
    labelType: { label: 'Roof 1', value: '1' },
  };
};
