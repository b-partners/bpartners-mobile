import { AreaPictureDetails, AreaPictureMapLayer, CrupdateAreaPictureDetails } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Dimensions, ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';

import { BpSheetSelect } from '../../../components';
import { BpInputSelectSimpleTextRenderer } from '../../../components/bp-input';
import { ZOOM_LEVEL, useAnnotationMenu } from '../../../form';
import { useSheetModal } from '../../../hook';
import { palette } from '../../../theme/palette';

interface AnnotationMenuProps {
  areaPictureDetails: AreaPictureDetails;
  updateAreaPictureDetails: (areaPictureDetails: CrupdateAreaPictureDetails) => void;
  isAreaPictureLoading: boolean;
  navigate: (...params: any[]) => void;
}

const getLayerTitle = (map: AreaPictureMapLayer) => {
  const { name, year, precisionLevelInCm } = map || {};
  return `${name} ${year} ${precisionLevelInCm}cm`;
};

export const AnnotationMenu: FC<AnnotationMenuProps> = ({ areaPictureDetails, isAreaPictureLoading, updateAreaPictureDetails, navigate }) => {
  const { width, height } = Dimensions.get('screen');
  const { otherLayers } = areaPictureDetails;
  const form = useAnnotationMenu(areaPictureDetails);
  const { close } = useSheetModal();
  const extendPicture = () => {
    updateAreaPictureDetails({ isExtended: !areaPictureDetails.isExtended });
    close();
  };

  const handleChangeLayerOrZoom = form.handleSubmit(data => {
    updateAreaPictureDetails({ zoomLevel: data.zoomLevel, layerId: data.layer.id });
    close();
  });

  const cancelAnnotations = () => {
    navigate('home', { screen: 'prospect' });
  };

  return (
    <ScrollView style={{ padding: 10, width, height: height * 0.5 }}>
      <View style={{ height: height * 0.5 }}>
        <FormProvider {...form}>
          <BpSheetSelect
            label='Niveau de zoom'
            name='zoomLevel'
            getItemTitle={({ label }) => label}
            getItemValue={({ value: currentValue }) => currentValue}
            getItemDefaultValue={currentValue => ZOOM_LEVEL.filter(({ value }) => currentValue === value)[0]}
            data={ZOOM_LEVEL}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
          <BpSheetSelect
            label="Source de l'image"
            name='layer'
            getItemTitle={getLayerTitle}
            data={otherLayers}
            renderItem={BpInputSelectSimpleTextRenderer()}
          />
        </FormProvider>
        <Button disabled={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }} onPress={handleChangeLayerOrZoom}>
          Appliquer les changements
        </Button>
        <View style={{ marginVertical: 10, borderBottomColor: palette.greyDarker, borderBottomWidth: 2 }} />
        <Button disabled={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }} onPress={extendPicture}>
          {areaPictureDetails?.isExtended ? "Réinitialiser l'image" : "Recentrer l'image"}
        </Button>
        <Button disabled={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }} onPress={cancelAnnotations}>
          Annuler toute l'annotation
        </Button>
        <Button disabled={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }}>
          Enregistrer l'annotation
        </Button>
      </View>
    </ScrollView>
  );
};
