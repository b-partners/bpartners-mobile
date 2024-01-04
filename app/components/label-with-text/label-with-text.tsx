import * as React from 'react';
import {useState} from 'react';
import {Image, View} from 'react-native';
import {Switch} from 'react-native-paper';

import {palette} from '../../theme/palette';
import {Text} from '../text/text';
import {useStores} from "../../models";
import {translate} from "../../i18n";
import {showMessage} from "../../utils/snackbar";
import {Log} from "../../screens/welcome/utils/utils";

export function LabelWithTextRow(props) {
    const {label, text, switchTVA, countryFlag} = props;
    const { authStore } = useStores();
    const { currentAccountHolder } = authStore;
    const [isSwitchOn, setIsSwitchOn] = useState(currentAccountHolder?.companyInfo?.isSubjectToVat);

    const onToggleSwitch = async () => {
        try {
            setIsSwitchOn(!isSwitchOn);
            Log(currentAccountHolder);
            // await authStore.updateCompanyInfos(currentAccountHolder);
        } catch (e) {
            showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
            throw e;
        }
    };

    return (
        <View
            style={{
                height: 60,
                marginHorizontal: '5%',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Text
                tx={label}
                style={{
                    fontSize: 13,
                    color: palette.lighterBlack,
                    fontFamily: 'Geometria',
                    width: '50%',
                    textTransform: 'uppercase',
                }}
            />
            <Text
                text={text}
                style={{
                    fontSize: 15,
                    color: palette.darkBlack,
                    fontFamily: 'Geometria',
                }}
            />
            {countryFlag && (
                <Image
                    source={{uri: countryFlag}}
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 30,
                    }}
                />
            )}
            {switchTVA && (
                <>
                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch}/>
                    <Text
                        tx={isSwitchOn ? 'common.yes' : 'common.no'}
                        style={{
                            fontSize: 15,
                            color: palette.darkBlack,
                            fontFamily: 'Geometria',
                        }}
                    />
                </>
            )}
        </View>
    );
}

export function LabelWithTextColumn(props) {
    const {label, text} = props;
    return (
        <View
            style={{
                height: 60,
                marginHorizontal: '5%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text
                tx={label}
                style={{
                    fontSize: 13,
                    color: palette.lighterBlack,
                    fontFamily: 'Geometria',
                    width: '100%',
                    textTransform: 'uppercase',
                    marginVertical: 5,
                }}
            />
            <Text
                text={text}
                style={{
                    width: '100%',
                    fontSize: 15,
                    color: palette.darkBlack,
                    fontFamily: 'Geometria',
                    marginVertical: 5,
                }}
            />
        </View>
    );
}
