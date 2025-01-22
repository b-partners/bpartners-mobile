import { AreaPictureDetails, AreaPictureMapLayer, CrupdateAreaPictureDetails, ZoomLevel } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import { BpButton as Button } from '../../../components/bp-button';
import { BpInputSelectBase, BpInputSelectSimpleTextRenderer } from '../../../components/bp-input';
import { useSheetModal } from '../../../hook';
import { zoomLevelMapper } from '../../../mappers';
import { ZOOM_LEVEL } from '../../../models/entities/area-picture/area-picture';
import { palette } from '../../../theme/palette';

interface AnnotationMenuProps {
  areaPictureDetails: AreaPictureDetails;
  updateAreaPictureDetails: (areaPictureDetails: CrupdateAreaPictureDetails) => void;
  isAreaPictureLoading: boolean;
}

export const getLayerTitle = (map: AreaPictureMapLayer) => {
  const { name, year, precisionLevelInCm } = map || {};
  return `${name} ${year} ${precisionLevelInCm}cm`;
};

export const AnnotationEditImageMenu: FC<AnnotationMenuProps> = ({ areaPictureDetails, isAreaPictureLoading, updateAreaPictureDetails }) => {
  const { width, height } = Dimensions.get('screen');
  const { otherLayers } = areaPictureDetails;
  const { close } = useSheetModal();
  const extendPicture = () => {
    updateAreaPictureDetails({ isExtended: !areaPictureDetails.isExtended });
    close();
  };

  const handleChangeZoomLevel = (zoomLevel: ZoomLevel) => {
    close();
    updateAreaPictureDetails({
      zoomLevel,
      layerId: areaPictureDetails.actualLayer.id,
      isExtended: false,
      zoom: zoomLevelMapper.toRest(ZOOM_LEVEL.find(({ value }) => value === zoomLevel)),
    });
  };

  const handleChangeLayer = (layer: any) => {
    close();
    updateAreaPictureDetails({ layerId: layer.id, zoomLevel: areaPictureDetails.zoomLevel, isExtended: false });
  };

  const handleShiftImage = (toLeft: boolean) => () => {
    close();
    updateAreaPictureDetails({ shiftNb: areaPictureDetails.shiftNb + (toLeft ? -1 : 1) });
  };

  return (
    <ScrollView style={{ padding: 10, width, height: height * 0.5 }}>
      <View style={{ height: height * 0.5 }}>
        <BpInputSelectBase
          onChange={handleChangeZoomLevel}
          value={areaPictureDetails.zoomLevel}
          label='Niveau de zoom'
          name='zoomLevel'
          getItemTitle={({ label }) => label}
          getItemValue={({ value: currentValue }) => currentValue}
          getItemDefaultValue={currentValue => ZOOM_LEVEL.filter(({ value }) => currentValue === value)[0]}
          data={ZOOM_LEVEL}
          renderItem={BpInputSelectSimpleTextRenderer()}
        />
        <BpInputSelectBase
          onChange={handleChangeLayer}
          value={areaPictureDetails.actualLayer}
          label="Source de l'image"
          name='layer'
          getItemTitle={getLayerTitle}
          data={otherLayers}
          renderItem={BpInputSelectSimpleTextRenderer()}
        />
        <Button loading={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }} onPress={extendPicture}>
          {areaPictureDetails?.isExtended ? "Réinitialiser l'image" : "Recentrer l'image"}
        </Button>
        {areaPictureDetails.isExtended && (
          <Button loading={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }} onPress={handleShiftImage(true)}>
            Décaler l'image vers la gauche
          </Button>
        )}
        {areaPictureDetails.isExtended && (
          <Button loading={isAreaPictureLoading} buttonColor={palette.purple} textColor='white' style={{ marginVertical: 5 }} onPress={handleShiftImage(false)}>
            Décaler l'image vers la droite
          </Button>
        )}
      </View>
    </ScrollView>
  );
};
