import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Button, Provider } from 'react-native-paper';

import { Header } from '../../components';
import { areaPictureMapper } from '../../mappers';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { useCreateAreaPicture } from '../../queries';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { AnnotationContainer } from './components';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ route }) {
  const [annotations, setAnnotations] = useState<AreaPictureAnnotationInstance[]>([]);
  const { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams } = route.params || {};
  const { areaPictureDetails, updateAreaPicture, pictureUrl, isLoading } = useCreateAreaPicture({
    defaultValues: { areaPictureDetails: areaPictureDetailsParams, pictureUrl: pictureUrlParams },
  });

  const extendPicture = () => {
    updateAreaPicture({
      crupdateAreaPictureDetails: areaPictureMapper.areaPicDetailsToCrupdate({ ...areaPictureDetails, isExtended: !areaPictureDetails.isExtended }),
      pictureId: areaPictureDetails.id,
    });
  };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon={'back'} style={HEADER} titleStyle={HEADER_TITLE} />
        <Button onPress={extendPicture}>Extend</Button>
        <AnnotationContainer
          isLoading={isLoading}
          pictureUrl={`${pictureUrl}&isExtended${areaPictureDetails.isExtended}`}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </ErrorBoundary>
    </Provider>
  );
});
