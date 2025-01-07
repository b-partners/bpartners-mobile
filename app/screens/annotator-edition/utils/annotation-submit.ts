import { AreaPictureAnnotation, AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';

import { annotatorProvider } from '../../../provider';
import { Measurement } from '../types';

interface MutationParams {
  isDraft?: boolean;
  draftAnnotationId?: string;
}

export const useAnnotationSubmit = (annotations: AreaPictureAnnotationInstance[], measurements: Measurement[], areaPictureDetails: AreaPictureDetails) => {
  const mutationFn = async (params: MutationParams) => {
    const { draftAnnotationId, isDraft = false } = params || {};
    const annotationIdValue = draftAnnotationId || uuid();
    const areaMeasurements = measurements.filter(({ unity }) => unity === 'm²');
    const requestBody: AreaPictureAnnotation = {
      annotations: annotations.map((annotation, index) => ({ ...annotation, metadata: { ...annotation.metadata, area: areaMeasurements[index].value } })),
      id: uuid(),
      idAreaPicture: areaPictureDetails.id,
      creationDatetime: new Date(),
      isDraft: isDraft,
    };
    return await annotatorProvider.annotatePicture(areaPictureDetails.id, annotationIdValue, requestBody);
  };

  const { mutate, isPending } = useMutation({ mutationKey: ['annotation', 'submit'], mutationFn });

  return {
    submitAnnotation: mutate,
    isLoading: isPending,
  };
};
