import { UpdateProspect } from '@bpartners/typescript-client';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Dimensions, View } from 'react-native';
import { Button } from 'react-native-paper';

import { BpSheetInput, Text } from '../../../components';
import { useCrupdateProspect } from '../../../queries';
import { palette } from '../../../theme/palette';
import { ProspectCreationStyle } from './style';

interface ProspectFormSheetModalProps {
  prospect?: UpdateProspect;
}

export const ProspectFormSheetModal: React.FC<ProspectFormSheetModalProps> = ({ prospect: defaultValues }) => {
  const { form, crupdate, isLoading } = useCrupdateProspect({ defaultValues: defaultValues });
  const { width, height } = Dimensions.get('screen');
  return (
    <View style={{ padding: 10, width, maxHeight: height * 0.7 }}>
      <View style={ProspectCreationStyle.headerContainer}>
        <Text text='Prospect : ' style={ProspectCreationStyle.headerTitle} />
      </View>
      <FormProvider {...form}>
        <BpSheetInput name='address' labelTx='prospectScreen.process.address' />
        <BpSheetInput name='name' labelTx='prospectScreen.process.name' />
        <BpSheetInput name='firstName' labelTx='prospectScreen.process.firstName' />
        <BpSheetInput name='email' labelTx='prospectScreen.process.email' />
        <BpSheetInput name='phone' labelTx='prospectScreen.process.phone' />
        <BpSheetInput multiline name='comment' labelTx='prospectScreen.process.comment' />
      </FormProvider>
      <View style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button loading={isLoading} onPress={crupdate} textColor={palette.white} style={{ backgroundColor: palette.secondaryColor }}>
          Créer
        </Button>
      </View>
    </View>
  );
};
