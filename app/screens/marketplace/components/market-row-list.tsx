import React, { useCallback } from 'react';
import { Alert, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import Market from 'react-native-vector-icons/Entypo';

import { AutoImage } from '../../../components';
import { translate } from '../../../i18n';
import { Marketplace } from '../../../models/entities/marketplace/marketplace';
import { palette } from '../../../theme/palette';
import {
  ANNOUNCE_CONTAINER_STYLE,
  ANNOUNCE_STYLE,
  CARD_CONTAINER_STYLE,
  CARD_ROW_CONTAINER_STYLE,
  CARD_ROW_STYLE,
  FLATLIST_CONTAINER_STYLE,
  FLATLIST_STYLE,
  MARKET_LIST_STYLE,
  ROW_LOGO_STYLE,
  TEXT_ROW_STYLE,
} from '../styles';

export function RowList(props: { marketplaces: Marketplace[] }) {
  const { marketplaces } = props;

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
        <FlatList
          data={marketplaces}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const logo = <AutoImage source={{ uri: item.logoUrl }} style={ROW_LOGO_STYLE} resizeMethod='resize' />;
            const placeholder = <Market name='shopping-cart' size={80} color={palette.lighterGrey} />;
            return (
              <View style={CARD_ROW_CONTAINER_STYLE}>
                <TouchableOpacity key={item.id} style={CARD_ROW_STYLE} onPress={() => handlePress(item.websiteUrl)}>
                  {item.logoUrl === 'logo URL' ? placeholder : logo}
                </TouchableOpacity>
                <Text style={TEXT_ROW_STYLE}>{item.name}</Text>
              </View>
            );
          }}
          style={FLATLIST_STYLE}
          contentContainerStyle={FLATLIST_CONTAINER_STYLE}
        />
      </View>
    </View>
  );
}
