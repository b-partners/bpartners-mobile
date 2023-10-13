import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AutoImage, Button, GradientBackground, Header, LabelWithTextRow, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { AccountHolder } from '../../models/entities/account-holder/account-holder';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { createFileUrl } from '../../utils/file-utils';
import { printCurrency } from '../../utils/money';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/components/utils';
import { AccountDeletionModal } from './components/account-deletion-modal';
import { profileStyles as styles } from './utils/styles';

export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function PaymentInitiationScreen({ navigation }) {
  const { authStore, businessActivityStore } = useStores();
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;
  const uri = createFileUrl(currentUser?.logoFileId, currentAccount?.id, accessToken, 'LOGO');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [accountHolder, setAccountHolder] = useState<AccountHolder>();

  useEffect(() => {
    (async () => {
      await businessActivityStore.getBusinessActivities({ page: 1, pageSize: invoicePageSize });
    })();
  }, []);

  useEffect(() => {
    if (currentAccountHolder) {
      setAccountHolder(currentAccountHolder);
    } else {
      setAccountHolder({
        name: '',
        siren: '',
        officialActivityName: '',
        contactAddress: {
          address: '',
          city: '',
          country: '',
          postalCode: '',
          prospectingPerimeter: null,
        },
        businessActivities: {
          primary: '',
          secondary: '',
        },
        companyInfo: {
          phone: '',
          townCode: null,
          isSubjectToVat: false,
          socialCapital: null,
          location: null,
          email: '',
          tvaNumber: '',
        },
        revenueTargets: {
          // @ts-ignore
          year: 0,
          amountTarget: null,
          amountAttempted: null,
          amountAttemptedPercent: null,
          updatedAt: null,
        },
      });
    }
  }, []);

  const country = accountHolder?.contactAddress?.country;
  const socialCapital = accountHolder?.companyInfo?.socialCapital;
  const amountTarget = accountHolder?.revenueTargets[0]?.amountTarget;

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='profileScreen.title' titleStyle={styles.headerTitle} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
      <View style={styles.container}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={styles.screen} preset='scroll'>
          <View style={styles.viewContainer}>
            {currentUser.logoFileId ? (
              <View style={styles.logoContainer}>
                <AutoImage source={{ uri }} style={styles.logo} resizeMethod='resize' resizeMode='stretch' />
              </View>
            ) : (
              <AutoImage
                source={require('../../components/bp-drawer/utils/profile-placeholder.png')}
                resizeMode='stretch'
                resizeMethod='auto'
                style={styles.logoPlaceholder}
              />
            )}
            <View style={styles.nameContainer}>
              <View>
                <Text text={currentUser.firstName.toString()} style={{ ...styles.name, color: palette.black }} />
                <Text text={currentUser.lastName.toString()} style={{ ...styles.name, color: palette.lightGrey }} />
                <View style={styles.phoneContainer}>
                  <PhoneIcon name='mobile-phone' size={24} color={palette.secondaryColor} />
                  <Text text={currentUser.phone} style={styles.phone} />
                </View>
              </View>
              <View style={styles.editionContainer}>
                <TouchableOpacity style={styles.editionIconContainer} onPress={() => navigation.navigate('profileEdition')}>
                  <MaterialCommunityIcons name='pencil' size={22} color={palette.lightGrey} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <LabelWithTextRow label='profileScreen.fields.accountHolder.name' text={accountHolder?.name ?? 'Aucune information'} />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.businessActivities.primary'
            text={accountHolder?.businessActivities?.primary ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.businessActivities.secondary'
            text={accountHolder?.businessActivities?.secondary ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.officialActivityName'
            text={accountHolder?.officialActivityName ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.companyInfo.socialCapital'
            text={isNaN(socialCapital) ? 'Aucune information' : printCurrency(socialCapital)}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.revenueTargets.amountTarget'
            text={isNaN(amountTarget) ? 'Aucune information' : printCurrency(amountTarget)}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.contactAddress.country'
            text={country ?? 'Aucune information'}
            countryFlag={`https://flagsapi.com/${country?.slice(0, 2)}/flat/64.png`}
          />
          <LabelWithTextRow label='profileScreen.fields.accountHolder.contactAddress.city' text={accountHolder?.contactAddress?.city ?? 'Aucune information'} />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.contactAddress.address'
            text={accountHolder?.contactAddress?.address ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.contactAddress.postalCode'
            text={accountHolder?.contactAddress?.postalCode ?? 'Aucune information'}
          />
          <LabelWithTextRow label='profileScreen.fields.accountHolder.siren' text={accountHolder?.siren ?? 'Aucune information'} />
          <Button
            tx='profileScreen.delete'
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {
              setConfirmationModal(true);
            }}
          />
          <AccountDeletionModal confirmationModal={confirmationModal} setConfirmationModal={setConfirmationModal} />
          <View style={styles.footer}>
            <Text tx={'profileScreen.footer.essential'} style={styles.footerTitle} />
            <Text tx={'profileScreen.footer.service'} style={{ ...styles.footerText, color: palette.lighterBlack }} />
            <Text tx={'profileScreen.footer.modifyInformations'} style={{ ...styles.footerText, color: palette.lighterBlack }} />

            <Text style={styles.linkContainer}>
              <Text
                onPress={() => Linking.openURL('https://www.bpartners.app/home')}
                text='BPartners, l’assistant intelligent des artisans et indépendants'
                style={{ ...styles.footerTitle, color: 'blue' }}
              />
              <Text text=', section mon compte' style={{ ...styles.footerText, color: palette.lighterBlack }} />
            </Text>
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
