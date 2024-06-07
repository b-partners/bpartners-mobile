import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import { ScrollView, TextStyle, TouchableOpacity, View } from 'react-native';
import { List } from 'react-native-paper';

import { Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { labelStyles } from '../utils/styles';

const AnnotationItem: FC<any> = props => {
  const { annotation, handleDeletePolygon } = props;
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const FIELD_STYLE: TextStyle = {
    position: 'relative',
    height: 70,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: palette.lighterGrey,
  };

  const BUTTON_STYLE: TextStyle = {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    marginVertical: spacing[3],
    borderWidth: 1,
    borderRadius: 3,
  };

  return (
    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={true}>
      <List.Section>
        <List.Accordion
          title={
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: palette.lightGrey,
                  paddingBottom: spacing[1],
                }}
              >
                {annotation?.labelName}
              </Text>
              <Text style={{ fontSize: 16, color: palette.white }}>{annotation?.labelType}</Text>
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
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.labelType'} style={labelStyles.key} />
              <Text text={annotation?.labelType} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.labelName'} style={labelStyles.key} />
              <Text text={annotation?.labelName} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.covering'} style={labelStyles.key} />
              <Text text={annotation?.covering} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.gradient'} style={labelStyles.key} />
              <Text text={annotation?.slope} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.usury'} style={labelStyles.key} />
              <Text text={annotation?.wearness} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.usuryRate'} style={labelStyles.key} />
              <Text text={annotation?.wearLevel} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.moldRate'} style={labelStyles.key} />
              <Text text={annotation?.moldRate} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.obstacle'} style={labelStyles.key} />
              <Text text={annotation?.obstacle} style={labelStyles.value} />
            </View>
            <View style={FIELD_STYLE}>
              <Text tx={'annotationScreen.labels.comment'} style={labelStyles.key} />
              <Text text={annotation?.comment} style={labelStyles.value} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setAccordionExpanded(false)}
                style={{
                  ...BUTTON_STYLE,
                  marginHorizontal: spacing[3],
                  width: '50%',
                  borderColor: palette.secondaryColor,
                  backgroundColor: palette.white,
                }}
              >
                <Text style={{ color: palette.secondaryColor, textAlign: 'center' }} tx={'common.closeSection'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletePolygon}
                style={{
                  ...BUTTON_STYLE,
                  borderColor: palette.white,
                  backgroundColor: palette.pastelRed,
                  width: '40%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name='delete' size={20} color={palette.white} />
                <Text style={{ color: palette.white, textAlign: 'center' }} tx={'common.delete'} />
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default AnnotationItem;
