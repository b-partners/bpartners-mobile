import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import { AutoImage, Header, Text } from '../../components';
import { BpButton } from '../../components/bp-button';
import { TabNavigatorParamList } from '../../navigators/utils';
import { StaticInformationItem } from './components/StaticInformationItem';
import { HomeScreenStyle, StaticInformationsRendererStyle } from './components/style';
import { StaticLeftInformationValues, StaticRightInformationValues } from './utilities/constants';

const images = [require('./assets/1.png'), require('./assets/2.png'), require('./assets/3.png')];

export const HomeScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { height, width } = Dimensions.get('screen');
  const createProspect = () => navigation.navigate('prospectForm');

  return (
    <View>
      <Header headerText='Accueil' />
      <ScrollView style={{ height: height * 0.7 }}>
        <View style={HomeScreenStyle.textHeaderContainer}>
          <Text
            text='Pour démarrer ajoutez une adresse et commencez à analyser les toitures de vos clients et prospects'
            style={HomeScreenStyle.textHeaderBlack}
          />
        </View>
        <View style={{ flex: 1, minHeight: height * 0.4 }}>
          <Carousel
            loop
            width={width}
            height={height * 0.4}
            data={images}
            style={{ margin: 0, padding: 0 }}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View style={{ position: 'relative' }}>
                <AutoImage style={{ width, height: height * 0.4 }} source={item} />
                <View style={[HomeScreenStyle.imageSource, { width }]}>
                  <Text text='NOTE DÉGRADATION GLOBALE: 41%' />
                </View>
                <View style={HomeScreenStyle.carouselTitleContainer}>
                  <Text text='Source: Image HD 5cm - Mars 2024' />
                </View>
              </View>
            )}
            mode='parallax'
          />
        </View>
        <Divider style={StaticInformationsRendererStyle.divider} />
        <View style={StaticInformationsRendererStyle.titleContainer}>
          <Text text='ANALYSE DE TOITURE' style={StaticInformationsRendererStyle.title} />
        </View>
        <Divider style={StaticInformationsRendererStyle.divider} />
        <View style={StaticInformationsRendererStyle.container}>
          <View>
            {StaticLeftInformationValues.map(item => (
              <StaticInformationItem staticInformation={item} key={item.title} />
            ))}
          </View>
          <View>
            {StaticRightInformationValues.map(item => (
              <StaticInformationItem staticInformation={item} key={item.title} />
            ))}
          </View>
        </View>
      </ScrollView>
      <BpButton style={{ position: 'absolute', bottom: 20, right: 10 }} onPress={createProspect}>
        Analyser la toiture d'un prospect/client
      </BpButton>
    </View>
  );
});
