import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen } from '../../components';
import { color, spacing } from '../../theme';
import { translate } from '../../i18n';
import { Formik } from 'formik';
import FormField from '../sign-in/components/FormField';
import * as yup from 'yup';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3] };
const INVALID_FORM_FIELD = {
  borderColor: '#FF5983',
  borderWidth: 2,
};

const validationSchema = yup.object().shape({
  amount: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
});

export const PaymentInitiationScreen: FC<DrawerScreenProps<NavigatorParamList, 'paymentInitiation'>> = observer(function PaymentInitiationScreen() {
  const initialValues = { label: '', reference: '', amount: null, payerName: '', payerEmail: '' };

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header headerTx='paymentInitiationScreen.title' style={HEADER} titleStyle={HEADER_TITLE} />
        <View style={FORM_FIELD_CONTAINER}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async values => {
              console.tron.log(values);
            }}
          >
            {({ handleSubmit, errors }) => {
              return (
                <>
                  <FormField name='label' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.label' />
                  <FormField name='reference' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.reference' />
                  <FormField
                    name='amount'
                    inputStyle={[FORM_FIELD_STYLE, errors.amount && INVALID_FORM_FIELD]}
                    placeholderTx='paymentInitiationScreen.fields.amount'
                    keyboardType='phone-pad'
                  />
                  <FormField name='payerName' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.payerName' />
                  <FormField name='payerEmail' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.payerEmail' />
                  <View>
                    <Button title={translate('paymentInitiationScreen.fields.submit')} onPress={() => handleSubmit()}>
                      {translate('paymentInitiationScreen.fields.submit')}
                    </Button>
                  </View>
                </>
              );
            }}
          </Formik>
        </View>
      </Screen>
    </View>
  );
});
