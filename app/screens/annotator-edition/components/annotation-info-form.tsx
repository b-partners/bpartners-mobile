import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { BackHandler, Dimensions, ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';

import { BpSheetInput, BpSheetSelect } from '../../../components';
import { BpInputSelectSimpleTextRenderer } from '../../../components/bp-input';
import { useAnnotationInfo } from '../../../form';
import { useSheetModal } from '../../../hook';
import { palette } from '../../../theme/palette';
import { annotationLabelList, annotatorCoveringList, annotatorSlopeImageList, annotatorWearnessList } from '../utils';
import { slopeRenderer } from './annotation-slope-renderer';

interface AnnotationInfoFormProps {
  annotation: AreaPictureAnnotationInstance;
  setAnnotation: (annotation: AreaPictureAnnotationInstance) => void;
}

export const AnnotationInfoForm: FC<AnnotationInfoFormProps> = ({ annotation, setAnnotation }) => {
  const { metadata, labelName, labelType } = annotation;
  const form = useAnnotationInfo({ ...metadata, labelName, labelType });
  const { width, height } = Dimensions.get('screen');
  const { close } = useSheetModal();

  const handlePress = form.handleSubmit(({ labelName: currentLabelName, labelType: currentLabelType, ...currentMetadata }) => {
    setAnnotation({ ...annotation, metadata: currentMetadata, labelName: currentLabelName, labelType: currentLabelType });
    close();
  });

  useEffect(() => {
    const handleBack = () => {
      close();
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBack);
  }, []);

  return (
    <ScrollView style={{ padding: 10, width, height: height * 0.6 }}>
      <View style={{ minHeight: height * 0.6, paddingBottom: 30 }}>
        <FormProvider {...form}>
          <BpSheetInput labelTx='annotationScreen.labels.labelName' name='labelName' multiline />
          <BpSheetSelect
            label='Type de label'
            name='labelType'
            getItemValue={({ id }) => id}
            getItemTitle={({ name }) => name}
            getItemDefaultValue={value => [...annotationLabelList.filter(({ id }) => id === value), null][0]}
            data={annotationLabelList}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
          <BpSheetSelect
            label='Revêtement'
            name='covering'
            getItemValue={({ id }) => id}
            getItemTitle={({ name }) => name}
            getItemDefaultValue={value => [...annotatorCoveringList.filter(({ id }) => id === value), null][0]}
            data={annotatorCoveringList}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
          <BpSheetSelect
            label='Pente'
            name='slope'
            getItemValue={({ id }) => id}
            getItemTitle={({ name }) => name}
            getItemDefaultValue={value => [...annotatorSlopeImageList.filter(({ id }) => id === value), null][0]}
            data={annotatorSlopeImageList}
            renderItem={BpInputSelectSimpleTextRenderer(slopeRenderer)}
          />
          <BpSheetSelect
            label='Usure'
            name='wearness'
            getItemValue={({ id }) => id}
            getItemTitle={({ name }) => name}
            getItemDefaultValue={value => [...annotatorWearnessList.filter(({ id }) => id === value), null][0]}
            data={annotatorWearnessList}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
          <BpSheetSelect
            label="Taux d'usure"
            name='wearLevel'
            data={new Array(11).fill(0).map((_value, index) => `${index * 10}`)}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
          <BpSheetSelect
            label='Taux de moisissure'
            name='moldRate'
            data={new Array(11).fill(0).map((_value, index) => `${index * 10}`)}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
          <BpSheetInput labelTx='annotationScreen.labels.obstacle' name='obstacle' multiline />
          <BpSheetInput labelTx='prospectScreen.process.comment' name='comment' multiline />
        </FormProvider>
        <View>
          <Button buttonColor={palette.purple} textColor='white' style={{ marginTop: 2 }} onPress={close}>
            Annuler
          </Button>
          <Button buttonColor={palette.purple} textColor='white' style={{ marginTop: 2 }} onPress={handlePress}>
            Enregistrer
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};
