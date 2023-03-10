import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Dropdown, Header, Screen, Text} from '../../components';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import {NavigatorParamList} from "../../navigators";
import {color, spacing} from "../../theme";
import {Card, Paragraph, Title} from 'react-native-paper';
import {Prospect} from "../../models/entities/prospect/prospect";
import {translate} from "../../i18n";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

type DropdowEnum = {
    id: number,
    name: string
};

const DropdownTab: DropdowEnum[] = [
    {
        id: 1,
        name: 'All'
    },
    {
        id: 2,
        name: 'To_Contact'
    },
    {
        id: 3,
        name: 'Contacted'
    },
    {
        id: 4,
        name: 'Converted'
    },
]

export const ProspectScreen: FC<DrawerScreenProps<NavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { prospectStore } = useStores();
  const { prospects } = prospectStore;

  const [ status, setStatus ] = useState<DropdowEnum>({
      id: 0,
      name: 'All'
  });

    useEffect(() => {
        prospectStore.getProspects();
    }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={{ flex: 1, display: 'flex', flexDirection: 'column',}}>
        <Screen preset='scroll' backgroundColor={palette.white} style={{ height: '100%' }}>
          <Header headerTx='marketPlaceScreen.header' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
            <View style={{ width: '100%', height: '10%', backgroundColor: palette.Khaki, marginBottom: spacing[3] }}>
                <Dropdown<DropdowEnum>
                    items={DropdownTab}
                    labelField={status.name}
                    valueField={status.id.toString()}
                    onChangeText={() => {}}
                    onChange={status => setStatus(status)}
                    placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
                    value={status}
                    dropdownContainerStyle={{ padding: 0 }}
                    style={{
                        backgroundColor: palette.secondaryColor,
                        borderRadius: 25,
                        paddingHorizontal: spacing[4],
                        height: 50,
                    }}
                    selectedItemTextStyle={{ color: 'black', fontFamily: 'Geometria-Bold' }}
                    itemTextStyle={{ color: 'black', fontFamily: 'Geometria' }}
                    placeholderTextStyle={{ color: 'black', fontFamily: 'Geometria-Bold' }}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, borderRadius: 25, backgroundColor: color.palette.Khaki, padding: spacing[3], }}>
                            <View >
                                <Text
                                    text={status.name}
                                    style={{
                                        color: 'black',
                                        fontFamily: 'Geometria-Bold',
                                    }}
                                />
                            </View>
                        <AntDesignIcon name='edit' size={15} style={{ color: color.palette.white, flex: 1 }} />
                    </View>
                </Dropdown>
            </View>
                <ScrollView style={{ width: '95%', height: '70%', borderWidth: 2, borderColor: palette.greyDarker, borderRadius: 10, alignSelf: 'center' }} contentContainerStyle={{ alignItems: 'center', }}>
                    {prospects.map((item: Prospect) => {
                        return (
                            <View key={item.id} style={{ width: '95%', alignItems: 'center', marginVertical: 5, }}>
                                <Card style={{ width: '100%' }}>
                                    <Card.Content>
                                        <Title>{item.name}</Title>
                                        <Paragraph>{item.email}</Paragraph>
                                    </Card.Content>
                                </Card>
                            </View>
                        );
                    })}
                </ScrollView>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
