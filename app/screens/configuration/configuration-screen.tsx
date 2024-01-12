import {MaterialCommunityIcons} from '@expo/vector-icons';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {TouchableOpacity, View} from 'react-native';
import {ProgressBar, Provider} from 'react-native-paper';

import {Button, Header, InputField, Loader, Text} from '../../components';
import {translate} from '../../i18n';
import {NavigatorParamList} from '../../navigators/utils/utils';
import {color, spacing} from '../../theme';
import {palette} from '../../theme/palette';
import {showMessage} from '../../utils/snackbar';
import {ErrorBoundary} from '../error/error-boundary';
import {FULL, SHADOW_STYLE} from '../invoices/utils/styles';
import {HEADER, HEADER_TITLE} from '../payment-initiation/utils/style';
import {Log} from '../welcome/utils/utils';
import {RelaunchConfiguration} from "../../models/entities/relaunch-configuration/relaunch-configuration";
import {useStores} from "../../models";

export const ConfigurationScreen: FC<DrawerScreenProps<NavigatorParamList, 'configuration'>> = observer(function ConfigurationScreen({navigation}) {
    const [loading, setLoading] = useState(true);
    const [relaunchConf, setRelaunchConf] = useState<RelaunchConfiguration>();

    const {invoiceStore} = useStores();

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
    } = useForm({
        mode: 'all',
    });

    const hasErrors = errors.unpaidRelaunch || errors.draftRelaunch;

    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            setLoading(true);
            try {
                const relaunchConf = await invoiceStore.getInvoiceRelaunchConf();
                if (!isCancelled) {
                    setRelaunchConf(relaunchConf);
                }
            } catch (e) {
                if (!isCancelled) {
                    showMessage(translate('errors.somethingWentWrong'), {backgroundColor: palette.pastelRed});
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        if (relaunchConf) {
            setValue('unpaidRelaunch', relaunchConf.unpaidRelaunch?.toString());
            setValue('draftRelaunch', relaunchConf.draftRelaunch?.toString());
        }
    }, [relaunchConf, setValue]);

    const onSubmit = async configurations => {
        setLoading(true);
        try {
            Log(configurations);
            //await authStore.updateGlobalInfos(newInfos);
        } catch (e) {
            showMessage(translate('errors.somethingWentWrong'), {backgroundColor: palette.pastelRed});
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Provider>
            <ErrorBoundary catchErrors='always'>
                <Header
                    headerTx='configurationScreen.title'
                    leftIcon={'back'}
                    onLeftPress={() => navigation.navigate('home')}
                    style={HEADER}
                    titleStyle={HEADER_TITLE}
                />
                {loading && <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true}
                                         style={{marginTop: spacing[2]}}/>}
                <View testID='ConfigurationScreen'
                      style={{...FULL, backgroundColor: color.palette.white, padding: spacing[3]}}>
                    <Text
                        tx={'configurationScreen.RelaunchFrequency'}
                        style={{
                            color: palette.black,
                            fontSize: 18,
                            paddingBottom: spacing[1],
                            marginBottom: spacing[4],
                            borderBottomWidth: 1,
                            borderColor: palette.lighterGrey,
                        }}
                    />
                    <Text tx={'configurationScreen.UnconfirmedQuotation'}
                          style={{color: palette.black, fontSize: 16, marginBottom: spacing[3]}}/>
                    <View style={{marginBottom: 20, width: '60%'}}>
                        <Controller
                            control={control}
                            name='draftRelaunch'
                            rules={{
                                required: translate('errors.required'),
                            }}
                            render={({field: {onChange, value}}) => (
                                <InputField
                                    labelTx={'configurationScreen.DayNumber'}
                                    error={!!errors.draftRelaunch}
                                    value={value}
                                    onChange={onChange}
                                    errorMessage={errors.draftRelaunch?.message as string}
                                    backgroundColor={palette.white}
                                />
                            )}
                        />
                    </View>
                    <Text tx={'configurationScreen.LateInvoice'}
                          style={{color: palette.black, fontSize: 16, marginBottom: spacing[3]}}/>
                    <View style={{marginBottom: 20, width: '60%'}}>
                        <Controller
                            control={control}
                            name='unpaidRelaunch'
                            rules={{
                                required: translate('errors.required'),
                            }}
                            render={({field: {onChange, value}}) => (
                                <InputField
                                    labelTx={'configurationScreen.DayNumber'}
                                    keyboardType={'numeric'}
                                    error={!!errors.unpaidRelaunch}
                                    value={value}
                                    onChange={onChange}
                                    errorMessage={errors.unpaidRelaunch?.message as string}
                                    backgroundColor={palette.white}
                                />
                            )}
                        />
                    </View>
                    <View style={{marginBottom: 20, width: '60%'}}>
                        {hasErrors ? (
                            <Button
                                tx='profileEditionScreen.activity.register'
                                style={{
                                    ...SHADOW_STYLE,
                                    backgroundColor: palette.solidGrey,
                                    marginVertical: spacing[1],
                                    marginHorizontal: spacing[1],
                                    borderRadius: 5,
                                    paddingVertical: spacing[3],
                                    paddingHorizontal: spacing[2],
                                    width: '100%',
                                    marginTop: spacing[4],
                                }}
                                textStyle={{fontSize: 16, fontFamily: 'Geometria-Bold'}}
                            />
                        ) : (
                            <TouchableOpacity
                                style={{
                                    position: 'relative',
                                    backgroundColor: palette.secondaryColor,
                                    width: '100%',
                                    height: 40,
                                    alignSelf: 'center',
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: palette.secondaryColor,
                                }}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <View style={{justifyContent: 'center', marginRight: 8}}>
                                    {loading ? <Loader size={22} color={palette.white}/> :
                                        <MaterialCommunityIcons name='zip-disk' size={22} color={color.palette.white}/>}
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: color.palette.white,
                                        }}
                                    >
                                        {translate('common.register')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ErrorBoundary>
        </Provider>
    );
});
