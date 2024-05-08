import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup.string().required('errors.required').email('errors.invalidEmail'),
  password: yup.string().required('errors.required'),
});

const loginResolver = yupResolver(loginSchema);

type LoginFormType = yup.InferType<typeof loginSchema>;

export const useLoginForm = () =>
  useForm<LoginFormType>({
    mode: 'onBlur',
    resolver: loginResolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });
