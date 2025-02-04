import { AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import { BpButton as Button } from '../../../components/bp-button';
import { useSheetModal } from '../../../hook';
import { useExportAnnotationToPdf } from '../../../queries';
import { palette } from '../../../theme/palette';
import { Measurement } from '../types';
import { exportAnnotationMapper, useAnnotationSubmit } from '../utils';

interface AnnotationMenuProps {
  areaPictureDetails: AreaPictureDetails;
  isAreaPictureLoading: boolean;
  navigate: (...params: any[]) => void;
  draftAnnotationId?: string;
  initInvoice: () => void;
  annotations: AreaPictureAnnotationInstance[];
  measurements: Measurement[];
  resetAnnotation: () => void;
  imageUrl: string;
}

export const AnnotationNextMenu: FC<AnnotationMenuProps> = ({
  areaPictureDetails,
  isAreaPictureLoading,
  navigate,
  draftAnnotationId,
  initInvoice,
  annotations,
  measurements,
  resetAnnotation,
  imageUrl,
}) => {
  const { width, height } = Dimensions.get('screen');
  const { close } = useSheetModal();
  const { submitAnnotation, isLoading } = useAnnotationSubmit(annotations, measurements, areaPictureDetails, navigate);
  const { exportAsPdf, isPending: isExportPending } = useExportAnnotationToPdf();

  const handleExport = () => {
    exportAsPdf(exportAnnotationMapper.toExport(areaPictureDetails, imageUrl, annotations, measurements));
  };

  const cancelAnnotations = () => {
    resetAnnotation();
    close();
    navigate('home', { screen: 'prospect' });
  };

  const generateInvoice = () => {
    initInvoice();
    submitAnnotation({ onDone: close });
  };

  const saveAnnotation = () => {
    submitAnnotation({ draftAnnotationId, isDraft: true, onDone: close });
  };

  return (
    <ScrollView style={{ padding: 10, width, height: height * 0.5 }}>
      <View style={{ height: height * 0.5 }}>
        <Button
          loading={isLoading || isAreaPictureLoading}
          buttonColor={palette.purple}
          textColor='white'
          style={{ marginVertical: 5 }}
          onPress={cancelAnnotations}
        >
          Annuler toute l'annotation
        </Button>
        <Button
          loading={isLoading || isAreaPictureLoading || isExportPending}
          buttonColor={palette.purple}
          textColor='white'
          style={{ marginVertical: 5 }}
          onPress={handleExport}
        >
          Exporter entant que PDF
        </Button>
        <Button
          loading={isLoading || isAreaPictureLoading}
          buttonColor={palette.purple}
          textColor='white'
          style={{ marginVertical: 5 }}
          onPress={generateInvoice}
        >
          Générer un devis
        </Button>
        <Button
          loading={isLoading || isAreaPictureLoading}
          buttonColor={palette.purple}
          textColor='white'
          style={{ marginVertical: 5 }}
          onPress={saveAnnotation}
        >
          Enregistrer entant que brouillon
        </Button>
      </View>
    </ScrollView>
  );
};
