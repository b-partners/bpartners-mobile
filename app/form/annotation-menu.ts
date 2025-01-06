import { AreaPictureDetails } from '@bpartners/typescript-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  zoomLevel: z.custom(() => true),
  layer: z.custom(() => true),
});

const resolver = zodResolver(schema);

export const ZOOM_LEVEL = [
  {
    value: 'BUILDING',
    label: 'Quartier',
    lvl: 19,
  },
  {
    value: 'HOUSES_0',
    label: 'Parcelle cadastrale',
    lvl: 20,
  },
  {
    value: 'HOUSE_PROPERTY',
    label: 'Toiture',
    lvl: 23,
  },
];

export const useAnnotationMenu = (defaultValue: AreaPictureDetails) => {
  const form = useForm({ resolver });

  useEffect(() => {
    const zoomLevel = defaultValue?.zoom?.level;
    const layer = defaultValue?.actualLayer;
    form.setValue('zoomLevel', zoomLevel);
    form.setValue('layer', layer);
  }, [defaultValue]);

  return form;
};
