import { AreaPictureAnnotationInstanceMetadata } from '@bpartners/typescript-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  labelName: z.custom(() => true),
  labelType: z.custom(() => true),
  area: z.custom(() => true),
  slope: z.custom(() => true),
  covering: z.custom(() => true),
  comment: z.custom(() => true),
  humidity: z.custom(() => true),
  fillColor: z.custom(() => true),
  strokeColor: z.custom(() => true),
  obstacle: z.custom(() => true),
  wearLevel: z.custom(() => true),
  wearness: z.custom(() => true),
  moldRate: z.custom(() => true),
});

const resolver = zodResolver(schema);

export const useAnnotationInfo = (defaultValue?: AreaPictureAnnotationInstanceMetadata & { labelName?: string; labelType?: string }) => {
  const form = useForm({ resolver, mode: 'all' });

  useEffect(() => {
    Object.keys(defaultValue || {}).forEach(key => {
      form.setValue(key, defaultValue[key]);
    });
  }, [defaultValue]);

  return form;
};
