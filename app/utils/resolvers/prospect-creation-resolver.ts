import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const prospectInfoSchema = yup.object({
  email: yup.string(),
  phone: yup.string(),
  address: yup.string().required('errors.required'),
  name: yup.string().required('errors.required'),
  firstName: yup.string(),
  comment: yup.string(),
});

const prospectInfoResolver = yupResolver(prospectInfoSchema);

type ProspectInfoFormType = yup.InferType<typeof prospectInfoSchema>;

const defaultValues = {
  email: '',
  phone: '',
  address: '',
  name: '',
  firstName: '',
  comment: '',
};

export const useProspectInfoForm = () =>
  useForm<ProspectInfoFormType>({
    mode: 'onBlur',
    resolver: prospectInfoResolver,
    defaultValues,
  });
