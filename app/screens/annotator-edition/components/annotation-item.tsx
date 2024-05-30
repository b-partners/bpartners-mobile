import React, { FC, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { List } from 'react-native-paper';

import { Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { labelStyles } from '../utils/styles';

const AnnotationItem: FC<any> = props => {
  const { annotation } = props;
  //const {labelName, labelType: {label}, covering, slope, wearLevel, comment, obstacle} = annotation;
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  return (
    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={true}>
      <List.Section>
        <List.Accordion
          title={
            <View>
              <Text style={{ fontSize: 12, color: palette.lightGrey, paddingBottom: spacing[1] }}>{annotation?.labelName}</Text>
              <Text style={{ fontSize: 16, color: palette.white }}>{annotation?.labelType.label}</Text>
            </View>
          }
          id='1'
          style={{
            width: '100%',
            backgroundColor: palette.secondaryColor,
            borderRadius: 5,
            borderColor: palette.lighterGrey,
            borderWidth: 1,
            zIndex: 0,
          }}
          rippleColor={palette.lightGrey}
          titleStyle={{ color: palette.secondaryColor }}
          expanded={accordionExpanded}
          onPress={() => setAccordionExpanded(!accordionExpanded)}
          right={() => <List.Icon icon={accordionExpanded ? 'chevron-up' : 'chevron-down'} color='white' />}
        >
          <View
            style={{
              backgroundColor: palette.white,
              borderBottomWidth: 2,
              borderLeftWidth: 2,
              borderRightWidth: 2,
              borderColor: palette.secondaryColor,
              borderBottomStartRadius: 7,
              borderBottomEndRadius: 7,
            }}
          >
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.labelType'} style={labelStyles.key} />
              <Text text={annotation?.labelType.label} style={labelStyles.value} />
            </View>
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.labelName'} style={labelStyles.key} />
              <Text text={annotation?.labelName} style={labelStyles.value} />
            </View>
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.covering'} style={labelStyles.key} />
              <Text text={annotation?.covering} style={labelStyles.value} />
            </View>
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.gradient'} style={labelStyles.key} />
              <Text text={annotation?.slope} style={labelStyles.value} />
            </View>
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.usuryRate'} style={labelStyles.key} />
              <Text text={annotation?.wearLevel} style={labelStyles.value} />
            </View>
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.comment'} style={labelStyles.key} />
              <Text text={annotation?.comment} style={labelStyles.value} />
            </View>
            <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
              <Text tx={'annotationScreen.labels.obstacle'} style={labelStyles.key} />
              <Text text={annotation?.obstacle} style={labelStyles.value} />
            </View>
          </View>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default AnnotationItem;
