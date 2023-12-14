import React, {useEffect, useState} from 'react';
import {ScrollView, TextStyle, TouchableOpacity, View} from 'react-native';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {GradientBackground, Icon, LabelWithTextColumn, Screen, Text} from '../../../components';
import {translate} from '../../../i18n';
import {useStores} from '../../../models';
import {Account, AccountInfos} from '../../../models/entities/account/account';
import {color, spacing} from '../../../theme';
import {palette} from '../../../theme/palette';
import {showMessage} from '../../../utils/snackbar';
import {ErrorBoundary} from '../../error/error-boundary';
import {Logo} from '../../home/components/logo';
import {CustomerFormFieldFooter} from '../../invoice-form/components/customer/customer-form-field-footer';
import {getCurrentAccount, getCurrentAccountInfo} from '../utils/get-current-account';
import {BankEditionModal} from './bank-edition-modal';
import {BankSelectionField} from './bank-selection-field';
import {ProgressBar} from "react-native-paper";

export const Bank: React.FC = () => {
    const {authStore} = useStores();
    const {currentAccount} = authStore;

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accountList, setAccountList] = useState<Account []>();
    const [selectedAccount, setSelectedAccount] = useState<Account>();
    const [accountInfo, setAccountInfo] = useState<AccountInfos>();

    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            setLoading(true);
            try {
                const accounts = await authStore.getAccountList();
                if (!isCancelled) {
                    setAccountList(accounts);
                    setSelectedAccount(getCurrentAccount(accounts));
                    setAccountInfo(getCurrentAccountInfo(accounts));
                }
            } catch (e) {
                if (!isCancelled) {
                    showMessage(translate('errors.somethingWentWrong'), {backgroundColor: palette.pastelRed});
                    setShowModal(false);
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

    const CONTAINER_STYLE: TextStyle = {
        width: '90%',
        height: 300,
        backgroundColor: palette.solidGrey,
        marginHorizontal: '5%',
        marginTop: '5%',
        borderRadius: 10,
        flexDirection: 'column',
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{width: '100%', height: '100%', flexDirection: 'column'}}>
                <ErrorBoundary catchErrors='always'>
                    <View style={{flex: 1, width: '100%', height: '100%', flexDirection: 'column'}}>
                        <GradientBackground colors={['#422443', '#281b34']}/>
                        <Screen style={{borderWidth: 1, borderColor: palette.secondaryColor}} preset='scroll'>
                            {loading && <ProgressBar
                                progress={0.5}
                                color={palette.secondaryColor}
                                indeterminate={true}
                                style={{marginTop: spacing[2]}}
                            />}
                            <View style={CONTAINER_STYLE}>
                                <View style={{width: '100%', height: 70, marginTop: 20, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            width: '70%',
                                            height: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 28,
                                                fontFamily: 'Geometria',
                                                color: palette.black,
                                                width: '100%',
                                                padding: spacing[3],
                                            }}
                                        >
                                            {accountInfo?.name}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            width: '30%',
                                            height: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Logo uri={currentAccount?.bank?.logoUrl} logoStyle={{width: 140, height: 70}}/>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: '100%',
                                        flex: 1,
                                        marginTop: 15,
                                        flexDirection: 'column',
                                        marginBottom: 10,
                                    }}
                                >
                                    <LabelWithTextColumn label='bankScreen.accountName' text={accountInfo?.name}/>
                                    <LabelWithTextColumn label='bankScreen.bic' text={accountInfo?.bic}/>
                                    <LabelWithTextColumn label='bankScreen.iban' text={accountInfo?.iban}/>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{
                                    position: 'relative',
                                    backgroundColor: palette.secondaryColor,
                                    width: '90%',
                                    height: 40,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    marginTop: spacing[2],
                                    borderColor: palette.secondaryColor,
                                }}
                                onPress={() => setShowModal(true)}
                            >
                                <View style={{justifyContent: 'center', marginRight: 8}}>
                                    <IoniconIcon name='ios-pencil' size={22} color={color.palette.white}/>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: color.palette.white,
                                            fontFamily: 'Geometria',
                                        }}
                                    >
                                        {translate('common.edit')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                <Text
                                    style={{
                                        ...CONTAINER_STYLE,
                                        marginTop: spacing[5],
                                        color: palette.black,
                                        height: 50,
                                        textAlign: 'center',
                                        paddingVertical: spacing[3],
                                    }}
                                    tx={'bankScreen.changeIncomingAccount'}
                                />
                            </View>
                            <BankSelectionField
                                accounts={accountList}
                                selectedAccount={selectedAccount}
                                setSelectedAccount={setSelectedAccount}
                                onValueChange={newValue => {
                                    setSelectedAccount(newValue);
                                }}
                                labelTx='bankScreen.myAccount'
                                modalTx='bankScreen.accountSelection'
                                placeholderTx='invoiceScreen.labels.customerSectionPlaceholder'
                                items={accountList}
                                itemLabel='name'
                                itemValue='id'
                                itemSuffix={<Icon icon='edit'/>}
                                itemSuffixAction={() => {
                                }}
                                footer={<CustomerFormFieldFooter/>}
                                selectContainerStyle={{
                                    paddingHorizontal: spacing[4],
                                    width: '90%',
                                    alignSelf: 'center',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    borderColor: palette.lighterGrey,
                                    backgroundColor: palette.solidGrey,
                                    marginVertical: spacing[2],
                                }}
                                style={{}}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'relative',
                                    backgroundColor: palette.secondaryColor,
                                    width: '90%',
                                    height: 40,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: palette.secondaryColor,
                                }}
                                onPress={() => setShowModal(true)}
                            >
                                <View style={{justifyContent: 'center', marginRight: 8}}>
                                    <MaterialCommunityIcons name='zip-disk' size={22} color={color.palette.white}/>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: color.palette.white,
                                            fontFamily: 'Geometria',
                                        }}
                                    >
                                        {translate('common.register')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    position: 'relative',
                                    backgroundColor: palette.secondaryColor,
                                    width: '90%',
                                    height: 40,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    marginVertical: spacing[5],
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: palette.secondaryColor,
                                }}
                            >
                                <View style={{justifyContent: 'center', marginRight: 8}}>
                                    <MaterialCommunityIcon name='bank-outline' size={22} color={color.palette.white}/>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: color.palette.white,
                                            fontFamily: 'Geometria',
                                        }}
                                    >
                                        {translate('bankScreen.logout')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Screen>
                    </View>
                    {showModal && <BankEditionModal showModal={showModal} setShowModal={setShowModal} accountInfo={accountInfo} setAccountInfo={setAccountInfo} />}
                </ErrorBoundary>
            </View>
        </ScrollView>
    );
};
