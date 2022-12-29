import { Formik } from 'formik';
import React, { FC, PropsWithoutRef } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import * as yup from 'yup';

import { Button } from '../../../components';
import { useError } from '../../../hook';
import { useStores } from '../../../models';
import { color, spacing, typography } from '../../../theme';
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
  const { setError } = useError();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ phoneNumber: '' }}
      onSubmit={async ({ phoneNumber }) => {
        try {
          await authStore.signIn(phoneNumber);
        } catch (e) {
          return setError(e);
        }
        const { redirectionUrl } = authStore;
        next(redirectionUrl);
      }}
    >
      {({ handleSubmit, errors }) => {
        return (
          <>
            <FormField
              name='phoneNumber'
              inputStyle={[PHONE_NUMBER_STYLE, errors.phoneNumber && INVALID_PHONE_NUMBER]}
              placeholderTx='signInScreen.hint'
              keyboardType='phone-pad'
              labelTx='signInScreen.labels.phoneNumber'
              testID='phone-number'
            />
            <Button testID='submit-button' style={[CONTINUE]} textStyle={CONTINUE_TEXT} tx='signInScreen.confirm' onPress={() => handleSubmit()} />
          </>
        );
      }}
    </Formik>
  );
};
