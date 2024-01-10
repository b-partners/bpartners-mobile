import {DrawerScreenProps} from '@react-navigation/drawer';
import {observer} from 'mobx-react-lite';
import React, {FC, useState} from 'react';
import Slider from '@react-native-community/slider';
import {Provider} from 'react-native-paper';

import {Header, Text} from '../../components';
import {TabNavigatorParamList} from '../../navigators/utils/utils';
import {color, spacing} from '../../theme';
import {ErrorBoundary} from '../error/error-boundary';
import {FULL} from '../invoices/utils/styles';
import {HEADER, HEADER_TITLE} from '../payment-initiation/utils/style';
import {palette} from "../../theme/palette";
import {View} from "react-native";

export const ProspectConfigurationScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospectConfiguration'>> = observer(function ProspectConfigurationScreen({navigation}) {
    const [sliderValue, setSliderValue] = useState(0);

    return (
        <Provider>
            <ErrorBoundary catchErrors='always'>
                <Header headerTx='prospectConfigurationScreen.title' leftIcon={'back'}
                        onLeftPress={() => navigation.navigate('prospect')} style={HEADER} titleStyle={HEADER_TITLE}/>
                <View testID='ProspectConfigurationScreen' style={{...FULL, backgroundColor: color.palette.white}}>
                    <Text
                        tx={'prospectConfigurationScreen.setUpPerimeter'}
                        style={{
                            color: palette.black,
                            fontSize: 16,
                            borderBottomWidth: 1,
                            borderColor: palette.lighterGrey,
                            marginVertical: spacing[3],
                            paddingVertical: spacing[3],
                            marginHorizontal: spacing[3]
                        }}
                    />
                    <Slider
                        style={{width: 200, height: 40}}
                        minimumValue={0}
                        maximumValue={1}
                        value={sliderValue}
                        onValueChange={(value) => setSliderValue(value)}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </View>
            </ErrorBoundary>
        </Provider>
    );
});
