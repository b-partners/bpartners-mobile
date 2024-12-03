import { Prospect, ProspectStatus, UpdateProspect } from '@bpartners/typescript-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z as Zod } from 'zod';

import { prospectProvider } from '../provider';

const schema = Zod.object({
  email: Zod.string(),
  phone: Zod.string(),
  address: Zod.string({ message: 'errors.required' }).min(1, 'errors.required'),
  name: Zod.string({ message: 'errors.required' }).min(1, 'errors.required'),
  firstName: Zod.string(),
  comment: Zod.string(),
  id: Zod.custom(() => true),
  status: Zod.custom(() => true),
});

const resolver = zodResolver(schema);

export const updateProspectDefaultValues: UpdateProspect = {
  email: '',
  phone: '',
  address: '',
  name: '',
  firstName: '',
  status: ProspectStatus.TO_CONTACT,
};

const useProspectForm = (_defaultValues?: UpdateProspect) =>
  useForm<UpdateProspect>({
    mode: 'onBlur',
    resolver: resolver,
    defaultValues: _defaultValues || updateProspectDefaultValues,
  });

interface UseCrupdateProspectOptions {
  defaultValues?: UpdateProspect;
  queryOptions?: Omit<UseMutationOptions<Prospect, Error, UpdateProspect, unknown>, 'mutationFn' | 'mutationKey'>;
}

export const useCrupdateProspect = (options?: UseCrupdateProspectOptions) => {
  const { defaultValues, queryOptions } = options || {};
  const form = useProspectForm(defaultValues);
  const { data, mutate, isPending, ...others } = useMutation({
    mutationFn: prospectProvider.crupdateProspect,
    mutationKey: ['prospect', 'crupdate'],
    ...queryOptions,
  });
  const crupdate = form.handleSubmit((prospect: UpdateProspect) => {
    mutate({
      ...prospect,
      id: prospect.id || v4(),
    });
  });

  return { form, prospect: data, isLoading: isPending, crupdate, query: others };
};
