import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Dimensions, View } from 'react-native';

import { BpSheetInput } from '../../../components';
import { useAnnotationInfo } from '../../../form';

interface AnnotationInfoFormProps {
  annotation: AreaPictureAnnotationInstance;
}

export const AnnotationInfoForm: FC<AnnotationInfoFormProps> = ({ annotation }) => {
  const form = useAnnotationInfo(annotation.metadata);
  const { width, height } = Dimensions.get('screen');

  return (
    <View style={{ padding: 10, width, maxHeight: height * 0.7 }}>
      <FormProvider {...form}>
        <BpSheetInput labelTx='prospectScreen.process.comment' name='comment' multiline />
      </FormProvider>
    </View>
  );
};
