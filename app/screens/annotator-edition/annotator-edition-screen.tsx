import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Button, IconButton, Provider } from 'react-native-paper';
import MuiIcon from 'react-native-vector-icons/FontAwesome';

import { Header, Text } from '../../components';
import { useSheetModal } from '../../hook';
import { areaPictureMapper } from '../../mappers';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { useCreateAreaPicture } from '../../queries';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { AnnotationContainer, AnnotationInfoForm } from './components';
import { Measurement } from './types';
import { annotationLabelList, annotatorEditorScreen as style } from './utils';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ route }) {
  const { open: openSheetModal } = useSheetModal();
  const [annotations, setAnnotations] = useState<AreaPictureAnnotationInstance[]>([]);
  const { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams } = route.params || {};
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const { areaPictureDetails, updateAreaPicture, pictureUrl, isLoading } = useCreateAreaPicture({
    defaultValues: { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams },
  });

  const extendPicture = () => {
    setAnnotations([]);
    updateAreaPicture({
      crupdateAreaPictureDetails: areaPictureMapper.areaPicDetailsToCrupdate({ ...areaPictureDetails, isExtended: !areaPictureDetails.isExtended }),
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

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
        <Button buttonColor={palette.purple} textColor='white' style={{ marginHorizontal: 20, marginVertical: 5 }} onPress={extendPicture}>
          Recentrer l'image
        </Button>
        <AnnotationContainer
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
          {annotations.map(({ annotationId, labelName, labelType }, index) => (
            <View style={style.annotationListContainer} key={annotationId}>
              <View style={style.polygonRefContainer}>
                <Text style={style.polygonRefText} text={'P' + (index + 1)} />
              </View>
              <View style={style.annotationListItemTitleContainer}>
                <Text style={style.annotationListItemTitle} text={labelName} />
                {labelType ? (
                  <Text style={style.annotationListItemLabel} text={annotationLabelList.filter(({ id }) => id === labelType)[0].name} />
                ) : (
                  <View style={style.annotationListItemLabelContainer}>
                    <MuiIcon color={palette.yellow} name='warning' size={15} />
                    <Text style={style.annotationListItemLabel} text='Veuillez ajouter un label' />
                  </View>
                )}
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
