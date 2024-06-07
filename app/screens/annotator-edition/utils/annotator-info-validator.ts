import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { translate } from '../../../i18n';
import { Wearness } from '../../../models/entities/annotation-metadata/annotation-metadata';
import { annotationCommaValidation } from './annotationCommaValidation';
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
  covering: yup.string(),
  slope: yup.string().test(
    'comma validation',
    () => translate('errors.invalidPercent'),
    value => annotationCommaValidation(value)
  ),
  comment: yup.string(),
  obstacle: yup.string(),
  wearness: yup
    .object()
    .shape({
      label: yup.string().nullable(),
      value: yup.string().oneOf(Object.values(Wearness)).nullable(),
    })
    .nullable(),
  wearLevel: yup
    .object()
    .shape({
      label: yup.string().nullable(),
      value: yup.string().nullable(),
    })
    .nullable(),
  moldRate: yup
    .object()
    .shape({
      label: yup.string().nullable(),
      value: yup.string().nullable(),
    })
    .nullable(),
});

export const getAnnotatorResolver = () => {
  return yupResolver(annotatorInfoResolver);
};

export const getDefaultValue = polygonLength => {
  return {
    labelName: getPolygonName(polygonLength),
    labelType: { label: 'Roof 1', value: '1' },
    covering: '',
    slope: '',
    wearLevel: '',
    comment: '',
    obstacle: '',
    moldRate: '',
    wearness: '',
  };
};
