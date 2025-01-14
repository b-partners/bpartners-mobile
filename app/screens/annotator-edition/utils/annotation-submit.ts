import { AreaPictureAnnotation, AreaPictureAnnotationInstance, AreaPictureDetails, InvoiceStatus } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';

import { annotatorProvider } from '../../../provider';
import { notify } from '../../../utils/snackbar';
import { storage } from '../../../utils/storage';
import { Measurement } from '../types';

interface MutationParams {
  isDraft?: boolean;
  draftAnnotationId?: string;
}

const isAnnotationsValid = (areaPictureAnnotation: AreaPictureAnnotation) => {
  const annotationsWithoutLabels = areaPictureAnnotation.annotations.filter(({ labelName }) => !!labelName);
  return annotationsWithoutLabels.length === 0;
};

export const useAnnotationSubmit = (
  annotations: AreaPictureAnnotationInstance[],
  measurements: Measurement[],
  areaPictureDetails: AreaPictureDetails,
  navigate: (...args: any[]) => void
) => {
  const mutationFn = async (params: MutationParams) => {
    const { draftAnnotationId, isDraft = false } = params || {};
    const annotationIdValue = draftAnnotationId ?? uuid();
    const areaMeasurements = measurements.filter(({ unity }) => unity === 'm²');
    const userId = await storage.loadUserId();
    const requestBody: AreaPictureAnnotation = {
      annotations: annotations.map((annotation, index) => ({
        ...annotation,
        metadata: { ...annotation.metadata, area: areaMeasurements[index].value },
        areaPictureId: areaPictureDetails.id,
        userId,
        annotationId: annotationIdValue,
      })),
      id: annotationIdValue,
      idAreaPicture: areaPictureDetails.id,
      creationDatetime: new Date(),
      isDraft: isDraft,
    };

    if (!isAnnotationsValid(requestBody)) {
      notify('Veuillez ajouter un label pour chaque annotation.', 'error');
      return null;
    }

    const data = await annotatorProvider.annotatePicture(areaPictureDetails.id, annotationIdValue, requestBody);
    navigate('invoiceForm', { areaPictureId: areaPictureDetails.id, invoiceId: uuid(), initialStatus: InvoiceStatus.DRAFT } as any);
    return data;
  };

  const { mutate, isPending } = useMutation({ mutationKey: ['annotation', 'submit'], mutationFn });

  return {
    submitAnnotation: mutate,
    isLoading: isPending,
  };
};
