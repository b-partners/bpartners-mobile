import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';

import { Button, InputField } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { LabelledDropdown } from '../../../components/labelled-dropdown/labelled-dropdown';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../../invoices/utils/styles';
import { getDefaultValue } from '../utils/annotator-info-validator';
import { coveringOptions, labelTypes, rangeOptions, slopeOptions, wearnessOptions } from '../utils/select-options';
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
          <LabelledDropdown control={control} name={'labelType'} labelTx={'annotationScreen.labels.labelType'} data={labelTypes} />
          <LabelledDropdown control={control} name={'covering'} labelTx={'annotationScreen.labels.covering'} data={coveringOptions} />
          <LabelledDropdown control={control} name={'slope'} labelTx={'annotationScreen.labels.gradient'} data={slopeOptions} />
          <LabelledDropdown control={control} name={'wearness'} labelTx={'annotationScreen.labels.usury'} data={wearnessOptions} />
          <LabelledDropdown control={control} name={'wearLevel'} labelTx={'annotationScreen.labels.usuryRate'} data={rangeOptions} />
          <LabelledDropdown control={control} name={'moldRate'} labelTx={'annotationScreen.labels.moldRate'} data={rangeOptions} />
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
