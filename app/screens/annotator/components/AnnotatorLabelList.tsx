import React, { FC } from 'react';
import { List } from 'react-native-paper';

import { Annotation } from '../../../models/entities/annotation/annotation';
import { palette } from '../../../theme/palette';
import { accordionTheme } from '../utils/accordion-theme';
import AnnotationLabelRow from './annotator-label-row';
import { AnnotatorLabelListStyle as styles } from './styles';

interface AnnotatorLabelListProps {
  annotation: Annotation;
}

export const AnnotatorLabelList: FC<AnnotatorLabelListProps> = ({ annotation }) => {
  const { metadata, labelType: type } = annotation || {};
  const { covering, wearLevel: wear, slope, area } = metadata || {};
  const labels = { covering, wear, slope, area, type };
  return (
    <List.AccordionGroup>
      <List.Accordion
        title={annotation.labelName}
        id='1'
        style={styles.accordion}
        rippleColor={palette.lighterGrey}
        titleStyle={styles.accordionTitle}
        theme={accordionTheme}
      >
        <AnnotationLabelRow labelKey='type' labels={labels} />
        <AnnotationLabelRow labelKey='area' labels={labels} />
        <AnnotationLabelRow labelKey='covering' labels={labels} />
        <AnnotationLabelRow labelKey='slope' labels={labels} />
        <AnnotationLabelRow labelKey='wear' labels={labels} />
      </List.Accordion>
    </List.AccordionGroup>
  );
};
