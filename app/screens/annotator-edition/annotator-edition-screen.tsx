import { AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { IconButton, Provider } from 'react-native-paper';
import MuiIcon from 'react-native-vector-icons/FontAwesome';

import { Header, Text } from '../../components';
import { BpAccordion } from '../../components/bp-accordion';
import { BpButton } from '../../components/bp-button';
import { useResetRouteParams, useRouteParams, useRouteParamsEffect, useSheetModal } from '../../hook';
import { areaPictureMapper } from '../../mappers';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { useCreateAreaPicture } from '../../queries';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { AnnotationContainer, AnnotationEditImageMenu, AnnotationInfoForm, AnnotationNextMenu, getLayerTitle } from './components';
import { Measurement } from './types';
import { annotationLabelList, annotatorEditorScreen as style } from './utils';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const { open: openSheetModal } = useSheetModal();

  const {
    annotations: annotationsParams,
    areaPictureDetails: areaPictureDetailsParams,
    draftAnnotationId: draftAnnotationIdParams,
    pictureUrl: pictureUrlParams,
  } = useRouteParams(({ annotatorEdition }) => annotatorEdition);

  const [annotations = [], setAnnotations] = useState<AreaPictureAnnotationInstance[]>(annotationsParams);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useRouteParamsEffect('annotatorEdition', ({ annotations: newAnnotations }) => setAnnotations(newAnnotations));

  const { areaPictureDetails, updateAreaPicture, pictureUrl, isLoading } = useCreateAreaPicture({
    defaultValues: { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams },
  });
  const { invoiceStore } = useStores();

  useResetRouteParams('annotatorEdition', navigation);

  const updateAreaPictureDetails = (currentAreaPictureDetails: AreaPictureDetails) => {
    setAnnotations([]);
    updateAreaPicture({
      crupdateAreaPictureDetails: { ...areaPictureMapper.areaPicDetailsToCrupdate({ ...areaPictureDetails }), ...currentAreaPictureDetails },
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

  const resetAnnotation = () => {
    setAnnotations([]);
    setMeasurements([]);
  };

  const handleSetMeasurements = (currentMeasurements: Measurement[]) => {
    if ((annotations.length > 0 && currentMeasurements.length > 0) || annotations.length === 0) {
      setMeasurements(currentMeasurements);
    }
  };

  const handleOpenNextMenu = () => {
    openSheetModal(
      <AnnotationNextMenu
        resetAnnotation={resetAnnotation}
        annotations={annotations}
        measurements={measurements}
        draftAnnotationId={draftAnnotationIdParams}
        initInvoice={invoiceStore.saveInvoiceInit}
        navigate={navigation.navigate}
        isAreaPictureLoading={isLoading}
        areaPictureDetails={areaPictureDetails}
      />,
      { containerStyle: { height: height * 0.5 } }
    );
  };
  const handleOpenEditImageMenu = () => {
    openSheetModal(
      <AnnotationEditImageMenu isAreaPictureLoading={isLoading} updateAreaPictureDetails={updateAreaPictureDetails} areaPictureDetails={areaPictureDetails} />,
      { containerStyle: { height: height * 0.5 } }
    );
  };

  const measurementsArea = measurements.filter(({ unity }) => unity === 'm²');

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon='whiteMenu' style={HEADER} titleStyle={HEADER_TITLE} />
        {Object.keys(areaPictureDetailsParams).length > 0 && (
          <AnnotationContainer
            areaPictureDetails={areaPictureDetails}
            measurements={measurements}
            setMeasurements={handleSetMeasurements}
            filename={areaPictureDetails.filename}
            zoom={areaPictureDetails.zoom}
            isLoading={isLoading}
            pictureUrl={`${pictureUrl}&isExtended${areaPictureDetails.isExtended}&shiftNumber=${areaPictureDetails.shiftNb}`}
            annotations={annotations}
            setAnnotations={setAnnotations}
          />
        )}
        <ScrollView style={{ height }}>
          <View style={{ padding: 5, gap: 5 }}>
            <View style={{ padding: 5 }}>
              <Text style={style.annotationListItemLabel} text="Source de l'image:" />
              <Text style={style.annotationListItemTitle} text={getLayerTitle(areaPictureDetails.actualLayer)} />
            </View>
            <BpAccordion title='Annotations' defaultExpanded>
              {annotations.map(({ labelName, labelType, id: annotationId }, index) => (
                <View style={style.annotationListContainer} key={annotationId}>
                  <View style={style.polygonRefContainer}>
                    <Text style={style.polygonRefText} text={'P' + (index + 1)} />
                  </View>
                  <View style={style.annotationListItemTitleContainer}>
                    <Text style={style.annotationListItemTitle} text={labelName} />
                    <View style={style.areaAndLabelContainer}>
                      {measurementsArea.length >= index && (
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
            </BpAccordion>
            <View style={{ marginVertical: 10, borderBottomColor: palette.greyDarker, borderBottomWidth: 2 }} />
            <View style={style.actionButtons}>
              <BpButton onPress={handleOpenEditImageMenu} style={{ flexGrow: 1 }}>
                Modifier l'image
              </BpButton>
              <BpButton onPress={handleOpenNextMenu} style={{ flexGrow: 1 }}>
                Suivant
              </BpButton>
            </View>
          </View>
        </ScrollView>
      </ErrorBoundary>
    </Provider>
  );
});
