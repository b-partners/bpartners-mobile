import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components';
import { BpAccordion } from '../../../../components/bp-accordion';
import { useGetAreaPictureById, useQueryAnnotationByAreaPictureId } from '../../../../queries';
import { AnnotationContainer } from '../../../annotator-edition/components/annotation-container';
import { annotationLabelList } from '../../../annotator-edition/utils';
import { InvoiceAnnotationRendererStyle as styles } from './styles';

interface InvoiceAnnotationRendererProps {
  areaPictureId: string;
}

interface AnnotationInfoTextProps {
  title: string;
  content?: string;
}

const AnnotationInfoText: FC<AnnotationInfoTextProps> = ({ title, content }) => {
  return (
    <View style={styles.annotationInfoItemContainer}>
      <Text text={title} style={styles.annotationInfoItemTitle} />
      <Text text={content || 'Non renseigné'} style={styles.annotationInfoItemContent} />
    </View>
  );
};

export const InvoiceAnnotationRenderer: FC<InvoiceAnnotationRendererProps> = ({ areaPictureId }) => {
  const { data: areaPictureDetails, pictureUrl, isLoading: initialIsLoading } = useGetAreaPictureById(areaPictureId);

  const [measurements, setMeasurements] = useState([]);
  const { annotations, isLoading: isAnnotationLoading } = useQueryAnnotationByAreaPictureId(areaPictureId);

  return (
    <View>
      <AnnotationContainer
        isEditing={false}
        isLoading={initialIsLoading || isAnnotationLoading}
        pictureUrl={`${pictureUrl}&id=${areaPictureId}&isExtended=${areaPictureDetails?.isExtended}`}
        annotations={annotations || []}
        setAnnotations={() => {}}
        filename={areaPictureDetails.filename}
        zoom={areaPictureDetails.zoom || {}}
        measurements={measurements}
        setMeasurements={setMeasurements}
        areaPictureDetails={areaPictureDetails || {}}
      />
      {annotations?.map(({ labelName, labelType, metadata = {}, id }, index) => {
        const { area, covering, slope, wearness, wearLevel, moldRate, humidityLevel, obstacle, comment } = metadata;
        return (
          <View style={styles.annotationInfoContainer} key={`${id}-${index}`}>
            <BpAccordion title={`${labelName} (P${index + 1})`}>
              <AnnotationInfoText title='Type:' content={annotationLabelList.find(({ id: labelId }) => labelId === labelType)?.name} />
              <AnnotationInfoText title='Surface:' content={area ? `${area}m²` : null} />
              <AnnotationInfoText title='Revêtement:' content={covering} />
              <AnnotationInfoText title='Pente:' content={slope?.toString()} />
              <AnnotationInfoText title='Usure:' content={wearness} />
              <AnnotationInfoText title="Taux d'usure:" content={wearLevel?.toString()} />
              <AnnotationInfoText title='Taux de moisissure:' content={moldRate?.toString()} />
              <AnnotationInfoText title="Taux d'humidité:" content={humidityLevel?.toString()} />
              <AnnotationInfoText title='Obstacle:' content={obstacle} />
              <AnnotationInfoText title='Commentaire:' content={comment} />
            </BpAccordion>
          </View>
        );
      })}
    </View>
  );
};
