import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Modal } from 'react-native-paper';

import { Button, InputField, Text } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../../invoices/utils/styles';
import { getDefaultValue } from '../utils/annotator-info-validator';
import { dropDownStyles } from '../utils/styles';
import { getPolygonName } from '../utils/utils';

type AnnotationModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isKeyboardOpen: boolean;
  setKeyboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  control: any;
  polygonLength: number;
  errors: any;
  reset: any;
};

export const AnnotationModal: React.FC<AnnotationModalProps> = props => {
  const { showModal, setShowModal, setKeyboardOpen, errors, polygonLength, control, isKeyboardOpen, reset } = props;

  const labelTypes = [
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
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <Modal
        visible={showModal}
        dismissableBackButton={true}
        onDismiss={() => setShowModal(false)}
        style={{
          width: '94%',
          marginHorizontal: '3%',
          height: '100%',
          justifyContent: isKeyboardOpen ? 'flex-start' : 'center',
        }}
      >
        <View
          style={{
            backgroundColor: palette.white,
            borderWidth: 2,
            borderColor: palette.secondaryColor,
            borderRadius: 7,
          }}
        >
          <View style={{ width: '100%', height: 5 }}></View>
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
                  data={labelTypes}
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
            defaultValue={getPolygonName(polygonLength).toString()}
            render={({ field: { onChange, value } }) => (
              <InputField
                labelTx={'annotationScreen.labels.labelName'}
                error={!!errors.labelName}
                value={value}
                onChange={onChange}
                errorMessage={errors.labelName?.message}
                backgroundColor={palette.white}
                onStartShouldSetResponder={() => true}
              />
            )}
          />
          <Controller
            control={control}
            name='covering'
            defaultValue={getPolygonName(polygonLength).toString()}
            render={({ field: { onChange, value } }) => (
              <InputField
                labelTx={'annotationScreen.labels.covering'}
                error={!!errors.covering}
                value={value}
                onChange={onChange}
                errorMessage={errors.labelName?.message}
                backgroundColor={palette.white}
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
                backgroundColor={palette.white}
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
                backgroundColor={palette.white}
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
                backgroundColor={palette.white}
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
                backgroundColor={palette.white}
              />
            )}
          />
          <View
            style={{
              height: 60,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Button
              tx={'common.cancel'}
              style={{
                ...SHADOW_STYLE,
                backgroundColor: palette.secondaryColor,
                borderRadius: 5,
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[2],
                width: '43%',
                height: 40,
              }}
              onPress={() => {
                reset(getDefaultValue(0));
                setShowModal(false);
              }}
              textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
            />

            <Button
              tx={'common.save'}
              disabled={errors?.slope || errors?.wearLevel}
              style={{
                ...SHADOW_STYLE,
                backgroundColor: palette.secondaryColor,
                borderRadius: 5,
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[2],
                width: '43%',
                height: 40,
              }}
              onPress={() => setShowModal(false)}
              textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
            />
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
