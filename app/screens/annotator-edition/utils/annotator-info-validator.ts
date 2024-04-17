import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {translate} from "../../../i18n";

const annotatorInfoResolver = yup.object({
    label: yup.string().required(translate('errors.required')),
});

export const getAnnotatorResolver = () => {
    return yupResolver(annotatorInfoResolver);
};
