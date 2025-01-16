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
  onDone?: () => void;
}

const isAnnotationsValid = (areaPictureAnnotation: AreaPictureAnnotation) => {
  const annotationsWithoutLabels = areaPictureAnnotation.annotations.filter(({ labelType }) => !labelType);
  return annotationsWithoutLabels.length === 0;
};

const validator = (areaPictureAnnotation: AreaPictureAnnotation) => {
  if (areaPictureAnnotation?.annotations?.length === 0 && !areaPictureAnnotation.isDraft) {
    return 'Veuillez faire au moins une annotation avant de générer un devis';
  }
  if (!isAnnotationsValid(areaPictureAnnotation)) {
    return 'Veuillez ajouter un label pour chaque annotation.';
  }
  return null;
};

export const useAnnotationSubmit = (
  annotations: AreaPictureAnnotationInstance[],
  measurements: Measurement[],
  areaPictureDetails: AreaPictureDetails,
  navigate: (...args: any[]) => void
) => {
  const mutationFn = async (params: MutationParams) => {
    const { draftAnnotationId, isDraft = false, onDone } = params || {};
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

    const errorMessage = validator(requestBody);

    if (errorMessage) {
      notify(errorMessage, 'error');
      return null;
    }

    const data = await annotatorProvider.annotatePicture(areaPictureDetails.id, annotationIdValue, requestBody);
    onDone?.();
    if (isDraft) {
      navigate('home', { screen: 'prospect', params: { status: 'DRAFT' } });
    } else {
      navigate('invoiceForm', { areaPictureId: areaPictureDetails.id, invoiceId: uuid(), initialStatus: InvoiceStatus.DRAFT } as any);
    }
    return data;
  };

  const { mutate, isPending } = useMutation({ mutationKey: ['annotation', 'submit'], mutationFn });

  return {
    submitAnnotation: mutate,
    isLoading: isPending,
  };
};
