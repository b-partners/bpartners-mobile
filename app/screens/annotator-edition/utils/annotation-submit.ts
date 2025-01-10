import { AreaPictureAnnotation, AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';

import { TabNavigatorParamList } from '../../../navigators/utils';
import { annotatorProvider } from '../../../provider';
import { Measurement } from '../types';

interface MutationParams {
  isDraft?: boolean;
  draftAnnotationId?: string;
}

export const useAnnotationSubmit = (annotations: AreaPictureAnnotationInstance[], measurements: Measurement[], areaPictureDetails: AreaPictureDetails) => {
  const { navigate } = useNavigation<NavigationProp<TabNavigatorParamList, 'invoiceForm'>>();
  const mutationFn = async (params: MutationParams) => {
    const { draftAnnotationId, isDraft = false } = params || {};
    const annotationIdValue = draftAnnotationId ?? uuid();
    const areaMeasurements = measurements.filter(({ unity }) => unity === 'm²');
    const requestBody: AreaPictureAnnotation = {
      annotations: annotations.map((annotation, index) => ({ ...annotation, metadata: { ...annotation.metadata, area: areaMeasurements[index].value } })),
      id: annotationIdValue,
      idAreaPicture: areaPictureDetails.id,
      creationDatetime: new Date(),
      isDraft: isDraft,
    };
    const data = await annotatorProvider.annotatePicture(areaPictureDetails.id, annotationIdValue, requestBody);
    navigate('home', { screen: 'invoiceForm', areaPictureId: areaPictureDetails.id } as any);
    return data;
  };

  const { mutate, isPending } = useMutation({ mutationKey: ['annotation', 'submit'], mutationFn });

  return {
    submitAnnotation: mutate,
    isLoading: isPending,
  };
};
