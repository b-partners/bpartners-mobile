import React, { FC, PropsWithoutRef, useState } from 'react';
import { Formik } from 'formik';
import { TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { Button } from '../../../components';
import { color, spacing, typography } from '../../../theme';
import { useStores } from '../../../models';
import * as yup from 'yup';
import FormField from './form-field';

const PHONE_NUMBER_STYLE: TextStyle = {
  borderRadius: 10,
  padding: spacing[3],
  color: color.palette.black,
};

const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};

const BOLD: TextStyle = { fontWeight: 'bold' };

const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.deepPurple,
};
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
};

const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required()
    .matches(/^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/, 'Phone number is not valid')
    .min(10)
    .max(15)
    .label('Phone number'),
});
const INVALID_PHONE_NUMBER = {
  borderColor: '#FF5983',
  borderWidth: 2,
};

export const SignInForm: FC<PropsWithoutRef<{ next: (redirectionUrl: string) => void }>> = props => {
  const { authStore } = useStores();
  const { next } = props;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ phoneNumber: '' }}
      onSubmit={async ({ phoneNumber }) => {
        setIsLoading(true);
        await authStore.signIn(phoneNumber);
        const { redirectionUrl } = authStore;
        if (redirectionUrl) setIsLoading(false);
        next(redirectionUrl);
      }}
    >
      {({ handleSubmit, errors }) => {
        return (
          <>
            {isLoading && <ActivityIndicator size='small' />}
            <FormField
              name='phoneNumber'
              inputStyle={[PHONE_NUMBER_STYLE, errors.phoneNumber && INVALID_PHONE_NUMBER]}
              placeholderTx='signInScreen.hint'
              keyboardType='phone-pad'
              labelTx='signInScreen.labels.phoneNumber'
            />
            <Button testID='next-screen-button' style={[CONTINUE]} textStyle={CONTINUE_TEXT} tx='signInScreen.confirm' onPress={() => handleSubmit()} />
          </>
        );
      }}
    </Formik>
  );
};
