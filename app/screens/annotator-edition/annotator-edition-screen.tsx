import { AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { IconButton, Provider } from 'react-native-paper';
import MuiIcon from 'react-native-vector-icons/FontAwesome';

import { Header, Text } from '../../components';
import { useSheetModal } from '../../hook';
import { areaPictureMapper } from '../../mappers';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { useCreateAreaPicture } from '../../queries';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { AnnotationContainer, AnnotationInfoForm, AnnotationMenu } from './components';
import { Measurement } from './types';
import { annotationLabelList, annotatorEditorScreen as style, useAnnotationSubmit } from './utils';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({
  route,
  navigation,
}) {
  const { open: openSheetModal } = useSheetModal();
  const [annotations, setAnnotations] = useState<AreaPictureAnnotationInstance[]>([]);
  const { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams, draftAnnotationId: draftAnnotationIdParams } = route.params || {};
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const { areaPictureDetails, updateAreaPicture, pictureUrl, isLoading } = useCreateAreaPicture({
    defaultValues: { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams },
  });
  const { invoiceStore } = useStores();

  const updateAreaPictureDetails = (currentAreaPictureDetails: AreaPictureDetails) => {
    setAnnotations([]);
    updateAreaPicture({
      crupdateAreaPictureDetails: areaPictureMapper.areaPicDetailsToCrupdate({ ...areaPictureDetails, ...currentAreaPictureDetails }),
      pictureId: areaPictureDetails.id,
    });
  };

  const handleRemovePolygon = (index: number) => {
    setAnnotations(a => a.filter((_a, _index) => index !== _index));
  };

  const handleEditAnnotation = (index: number) => (annotation: AreaPictureAnnotationInstance) => {
    setAnnotations(p => {
      const currentAnnotations = p.slice();
      currentAnnotations[index] = annotation;
      return currentAnnotations;
    });
  };

  const { height } = Dimensions.get('screen');
  const handleEdit = (index: number) => {
    openSheetModal(<AnnotationInfoForm setAnnotation={handleEditAnnotation(index)} annotation={annotations[index]} />, {
      containerStyle: { height: height * 0.7 },
      panClose: false,
    });
  };

  const { submitAnnotation, isLoading: isAnnotationSubmitPending } = useAnnotationSubmit(annotations, measurements, areaPictureDetails, navigation.navigate);

  const handleOpenMenu = () => {
    openSheetModal(
      <AnnotationMenu
        draftAnnotationId={draftAnnotationIdParams}
        submitAnnotation={submitAnnotation}
        initInvoice={invoiceStore.saveInvoiceInit}
        navigate={navigation.navigate}
        isAreaPictureLoading={isLoading}
        updateAreaPictureDetails={updateAreaPictureDetails}
        areaPictureDetails={areaPictureDetails}
        isLoading={isAnnotationSubmitPending}
      />,
      {
        containerStyle: { height: height * 0.5 },
      }
    );
  };

  const measurementsArea = measurements.filter(({ unity }) => unity === 'm²');

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' onLeftPress={handleOpenMenu} leftIcon='whiteMenu' style={HEADER} titleStyle={HEADER_TITLE} />
        <AnnotationContainer
          areaPictureDetails={areaPictureDetails}
          measurements={measurements}
          setMeasurements={setMeasurements}
          filename={areaPictureDetails.filename}
          zoom={areaPictureDetails.zoom}
          isLoading={isLoading}
          pictureUrl={`${pictureUrl}&isExtended${areaPictureDetails.isExtended}`}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
        <ScrollView style={{ height: 70 }}>
          {annotations.map(({ labelName, labelType, id: annotationId }, index) => (
            <View style={style.annotationListContainer} key={annotationId}>
              <View style={style.polygonRefContainer}>
                <Text style={style.polygonRefText} text={'P' + (index + 1)} />
              </View>
              <View style={style.annotationListItemTitleContainer}>
                <Text style={style.annotationListItemTitle} text={labelName} />
                <View style={style.areaAndLabelContainer}>
                  {measurementsArea[index] && (
                    <Text style={style.annotationListItemLabel} text={measurementsArea[index]?.value + measurementsArea[index]?.unity + ' | '} />
                  )}
                  {labelType ? (
                    <Text style={style.annotationListItemLabel} text={annotationLabelList.filter(({ id }) => id === labelType)[0].name} />
                  ) : (
                    <View style={style.annotationListItemLabelContainer}>
                      <MuiIcon color={palette.yellow} name='warning' size={15} />
                      <Text style={style.annotationListItemLabel} text='Label requis' />
                    </View>
                  )}
                </View>
              </View>
              <IconButton icon={() => <MuiIcon color={palette.lighterPurple} name='edit' size={25} />} onPress={() => handleEdit(index)} />
              <IconButton icon={() => <MuiIcon color={palette.lighterPurple} name='trash-o' size={25} onPress={() => handleRemovePolygon(index)} />} />
            </View>
          ))}
        </ScrollView>
      </ErrorBoundary>
    </Provider>
  );
});
