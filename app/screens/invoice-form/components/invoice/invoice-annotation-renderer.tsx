import React, { FC, useState } from 'react';

import { useGetAreaPictureById, useQueryAnnotationByAreaPictureId } from '../../../../queries';
import { AnnotationContainer } from '../../../annotator-edition/components';

interface InvoiceAnnotationRendererProps {
  areaPictureId: string;
}

export const InvoiceAnnotationRenderer: FC<InvoiceAnnotationRendererProps> = ({ areaPictureId }) => {
  const { data: areaPictureDetails, pictureUrl, isLoading: initialIsLoading } = useGetAreaPictureById(areaPictureId);

  const [measurements, setMeasurements] = useState([]);
  const { annotations, isLoading: isAnnotationLoading } = useQueryAnnotationByAreaPictureId(areaPictureDetails?.id);

  return (
      <AnnotationContainer
        isEditing={false}
        isLoading={initialIsLoading || isAnnotationLoading}
        pictureUrl={`${pictureUrl}&isExtended=${areaPictureDetails.isExtended}`}
        annotations={annotations || []}
        setAnnotations={() => {}}
        filename={areaPictureDetails.filename}
        zoom={areaPictureDetails.zoom || {}}
        measurements={measurements}
        setMeasurements={setMeasurements}
        areaPictureDetails={areaPictureDetails || {}}
      />
  );
};
