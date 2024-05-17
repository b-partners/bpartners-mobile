import React, { FC, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { List } from 'react-native-paper';

import { InputField, Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { dropDownStyles, styles } from '../utils/styles';
import { getPolygonName } from '../utils/utils';

const AnnotationItem: FC<any> = props => {
  const { polygons, control, errors, watch } = props;
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const data = [
    { label: 'Roof 1', value: '1' },
    { label: 'Roof 2', value: '2' },
    { label: 'Roof 3', value: '3' },
    { label: 'Tree 1', value: '4' },
    { label: 'Tree 2', value: '5' },
    { label: 'Tree 3', value: '6' },
    { label: 'Pathway 1', value: '7' },
    { label: 'Pathway 2', value: '8' },
  ];

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={accordionExpanded ? styles.annotatorForm : { ...styles.annotatorForm, height: 90 }}
      showsVerticalScrollIndicator={true}
    >
      <List.Section>
        <List.Accordion
          title={
            <View>
              <Text style={{ fontSize: 12, color: palette.lightGrey, paddingBottom: spacing[1] }}>{watch('labelName')}</Text>
              <Text style={{ fontSize: 16, color: palette.white }}>{watch('labelType')?.label}</Text>
            </View>
          }
          id='1'
          style={{
            width: '100%',
            backgroundColor: palette.secondaryColor,
            borderTopLeftRadius: 7,
            borderTopRightRadius: 7,
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
              <Text
                tx={'annotationScreen.labels.labelType'}
                style={{
                  fontSize: 12,
                  color: palette.lightGrey,
                  paddingTop: spacing[3],
                  paddingLeft: spacing[4],
                }}
              />
              <Controller
                control={control}
                name='labelType'
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={dropDownStyles.dropdown}
                    placeholderStyle={dropDownStyles.placeholderStyle}
                    selectedTextStyle={dropDownStyles.selectedTextStyle}
                    inputSearchStyle={dropDownStyles.inputSearchStyle}
                    iconStyle={dropDownStyles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField='label'
                    valueField='value'
                    placeholder='Select item'
                    searchPlaceholder='Rechercher...'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name='labelName'
              defaultValue={getPolygonName(polygons.length).toString()}
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'annotationScreen.labels.labelName'}
                  error={!!errors.labelName}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.labelName?.message}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                  onStartShouldSetResponder={() => true}
                />
              )}
            />
            <Controller
              control={control}
              name='covering'
              defaultValue={getPolygonName(polygons.length).toString()}
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'annotationScreen.labels.covering'}
                  error={!!errors.covering}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.labelName?.message}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                />
              )}
            />
            <Controller
              control={control}
              name='slope'
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'annotationScreen.labels.gradient'}
                  keyboardType={'numeric'}
                  error={!!errors.slope}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.slope?.message}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                />
              )}
            />
            <Controller
              control={control}
              name='wearLevel'
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'annotationScreen.labels.usuryRate'}
                  keyboardType={'numeric'}
                  error={!!errors.wearLevel}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.wearLevel?.message}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                />
              )}
            />
            <Controller
              control={control}
              name='comment'
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'annotationScreen.labels.comment'}
                  error={!!errors.comment}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.comment?.message}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                />
              )}
            />
            <Controller
              control={control}
              name='obstacle'
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'annotationScreen.labels.obstacle'}
                  error={!!errors.obstacle}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.obstacle?.message}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                />
              )}
            />
          </View>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default AnnotationItem;
