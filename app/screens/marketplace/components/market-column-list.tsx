import React, { useCallback } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Market from 'react-native-vector-icons/Entypo';

import { AutoImage } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Marketplace } from '../../../models/entities/marketplace/marketplace';
import { palette } from '../../../theme/palette';
import {
  ANNOUNCE_CONTAINER_STYLE,
  ANNOUNCE_STYLE,
  CARD_CONTAINER_STYLE,
  CARD_STYLE,
  LOGO_STYLE,
  MARKET_LIST_STYLE,
  SCROLLVIEW_CONTAINER_STYLE,
  SCROLLVIEW_STYLE,
  TEXT_STYLE,
} from '../styles';

export function ColumnList() {
  const { marketplaceStore } = useStores();
  const { marketplaces } = marketplaceStore;

  const handlePress = useCallback(
    async (URL: string) => {
      const supported = await Linking.canOpenURL(URL);
      if (supported) {
        await Linking.openURL(URL);
      } else {
        Alert.alert(translate('errors.somethingWentWrong'));
      }
    },
    [URL]
  );

  return (
    <View style={MARKET_LIST_STYLE}>
      <View style={CARD_CONTAINER_STYLE}>
        <View style={ANNOUNCE_CONTAINER_STYLE}>
          <Text style={ANNOUNCE_STYLE}>{translate('marketPlaceScreen.offerTitle')}</Text>
        </View>
        <ScrollView style={SCROLLVIEW_STYLE} contentContainerStyle={SCROLLVIEW_CONTAINER_STYLE}>
          {marketplaces.map((item: Marketplace) => {
            const logo = <AutoImage source={{ uri: item.logoUrl }} style={LOGO_STYLE} resizeMethod='resize' />;
            const placeholder = <Market name='shopping-cart' size={80} color={palette.lighterGrey} />;
            return (
              <TouchableOpacity key={item.id} style={CARD_STYLE} onPress={() => handlePress(item.websiteUrl)}>
                {item.logoUrl === 'logo URL' ? placeholder : logo}
                <Text style={TEXT_STYLE}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
