import {DrawerScreenProps} from '@react-navigation/drawer';
import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {View} from 'react-native';
import {Provider} from 'react-native-paper';

import {Header} from '../../components';
import {TabNavigatorParamList} from '../../navigators/utils/utils';
import {color} from '../../theme';
import {ErrorBoundary} from '../error/error-boundary';
import {FULL} from '../invoices/utils/styles';
import {HEADER, HEADER_TITLE} from '../payment-initiation/utils/style';
import {CreationPortal} from './components/portal-creation';

export const AnnotatorScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'annotator'>> = observer(function AnnotatorScreen({navigation}) {

    return (
        <Provider>
            <ErrorBoundary catchErrors='always'>
                <Header
                    headerTx='prospectScreen.title'
                    leftIcon={'back'}
                    rightIcon={'settings'}
                    onLeftPress={() => navigation.navigate('bp_home')}
                    onRightPress={() => navigation.navigate('prospectConfiguration')}
                    style={HEADER}
                    titleStyle={HEADER_TITLE}
                />
                <View testID='AnnotatorScreen' style={{...FULL, backgroundColor: color.palette.white}}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <CreationPortal/>
                    </View>
                </View>
            </ErrorBoundary>
        </Provider>
    );
});
