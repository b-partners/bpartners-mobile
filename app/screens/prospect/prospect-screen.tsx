import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Header, Screen} from '../../components';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import {NavigatorParamList} from "../../navigators";
import {spacing} from "../../theme";
import {Card, Menu, Paragraph, Title} from 'react-native-paper';
import {Prospect} from "../../models/entities/prospect/prospect";
export const ProspectScreen: FC<DrawerScreenProps<NavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { prospectStore } = useStores();
  const { prospects } = prospectStore;

  const [ status, setStatus ] = useState<string>('TO_CONTACT');

    useEffect(() => {
        prospectStore.getProspects();
    }, []);

    return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={{ flex: 1, display: 'flex', flexDirection: 'column',}}>
        <Screen preset='scroll' backgroundColor={palette.white} style={{ height: '100%' }}>
          <Header headerTx='marketPlaceScreen.header' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
            <View style={{ width: '90%', height: '10%', marginTop: spacing[2],marginBottom: spacing[3], flexDirection: 'row', alignContent: 'space-around', alignSelf: 'center' }}>
                <Menu.Item onPress={() => setStatus('TO_CONTACT')} title="A Contacter" style={{ width: '30%', borderRightWidth: 2, borderColor: 'grey' }}/>
                <Menu.Item onPress={() => setStatus('CONTACTED')} title="Contacté" style={{ width: '30%', borderRightWidth: 2, borderColor: 'grey' }}/>
                <Menu.Item onPress={() => setStatus('CONVERTED')} title="Converti" style={{ width: '30%' }} />
            </View>
                <ScrollView style={{ width: '95%', height: '70%', borderWidth: 2, borderColor: palette.greyDarker, borderRadius: 10, alignSelf: 'center' }} contentContainerStyle={{ alignItems: 'center', }}>
                    {prospects.filter(item => item.status === status).map((item: Prospect) => {
                        return (
                            <View key={item.id} style={{ width: '95%', alignItems: 'center', marginVertical: 5, }}>
                                <Card style={{ width: '100%' }}>
                                    <Card.Content>
                                        <Title>{item.name ? item.name : 'Non renseigné'}</Title>
                                        <Paragraph>{item.email ? item.email : 'Non renseigné'}</Paragraph>
                                        <Paragraph>{item.phone ? item.phone : 'Non renseigné'}</Paragraph>
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
