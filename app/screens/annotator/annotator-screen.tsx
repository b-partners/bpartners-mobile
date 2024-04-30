import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { FlatList, Image, View, ViewStyle } from 'react-native';
import { Provider } from 'react-native-paper';

import { Button, Header, Separator, Text } from '../../components';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { profileStyles as styles } from '../profile/utils/styles';
import LabelRow from './components/label-row';

export const AnnotatorScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'annotator'>> = observer(function AnnotatorScreen({ navigation }) {
  const mockData = {
    address: '5b rue Paul Hevry 10430, Rosières-près-troyes',
    image: 'https://amazon-s3',
    labels: {
      surface: '142 m2',
      covering: 'Tiles',
      type: '2 PANS',
      gradient: '45°',
      wear: 'PARTIELLE',
      velux: null,
    },
  };

  const labelsKey = Object.keys(mockData.labels);

  const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header
          headerTx='annotationScreen.title'
          leftIcon={'back'}
          rightIcon={'settings'}
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => navigation.navigate('prospectConfiguration')}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <View testID='AnnotatorScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text text={mockData.address} style={{ color: palette.black, width: '50%', textAlign: 'center', marginVertical: spacing[3] }} />
            <View style={{ borderWidth: 1, borderColor: palette.black }}>
              <Image style={{ width: 220, height: 220 }} source={require('./assets/images/annotator_zan.jpg')} />
            </View>
            <Text tx={'common.labels'} style={{ color: palette.black, fontSize: 22, fontWeight: '700', width: '90%', marginVertical: spacing[3] }} />
            <FlatList
              style={{ width: '90%' }}
              data={labelsKey}
              keyExtractor={key => key}
              renderItem={({ item }) => {
                return <LabelRow labelKey={item} labels={mockData.labels} />;
              }}
              ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
            />
            <Button
              tx='annotationScreen.generateQuote'
              style={{ ...styles.button, width: '90%' }}
              textStyle={{ ...styles.buttonText, textTransform: 'uppercase' }}
              onPress={() => {}}
            />
          </View>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
