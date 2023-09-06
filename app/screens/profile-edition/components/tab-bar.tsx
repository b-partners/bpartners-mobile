import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';

type TabNameProps = {
  globalInfo: string;
  feedback: string;
  activity: string;
  companyInfo: string;
  revenueTargets: string;
};

export const TabBar: React.FC<MaterialTopTabBarProps> = props => {
  const { state, navigation } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRoute, setCurrentRoute] = useState(state.routes[currentIndex]);

  const TabName: TabNameProps = {
    globalInfo: translate('profileEditionScreen.globalInfo.title'),
    feedback: translate('profileEditionScreen.feedback.title'),
    activity: translate('profileEditionScreen.activity.title'),
    companyInfo: translate('profileEditionScreen.companyInfo.title'),
    revenueTargets: translate('profileEditionScreen.revenueTargets.title'),
  };
  const navigateToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const navigateToNext = () => {
    if (currentIndex < 5) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    setCurrentRoute(state.routes[currentIndex]);
  }, [currentIndex, state.routes]);

  useEffect(() => {
    if (currentRoute) {
      navigation.navigate(currentRoute.name);
    }
  }, [currentRoute, navigation]);

  return (
    <View style={{ width: '100%', height: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {currentIndex > 0 ? (
        <TouchableOpacity style={{ height: 40, width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={navigateToPrevious}>
          <EntypoIcon name='chevron-thin-left' size={20} color={palette.lightGrey} />
        </TouchableOpacity>
      ) : (
        <View style={{ height: 40, width: '20%', justifyContent: 'center', alignItems: 'center' }}>
          <EntypoIcon name='chevron-thin-left' size={20} color={palette.white} />
        </View>
      )}
      <View style={{ height: 40, width: '60%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: color.primary, fontWeight: '900', fontFamily: 'Geometria-Bold', fontSize: 18 }} text={TabName[currentRoute.name]} />
      </View>
      {currentIndex < 4 ? (
        <TouchableOpacity style={{ height: 40, width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={navigateToNext}>
          <EntypoIcon name='chevron-thin-right' size={20} color={palette.lightGrey} />
        </TouchableOpacity>
      ) : (
        <View style={{ height: 40, width: '20%', justifyContent: 'center', alignItems: 'center' }}>
          <EntypoIcon name='chevron-thin-right' size={20} color={palette.white} />
        </View>
      )}
    </View>
  );
};
