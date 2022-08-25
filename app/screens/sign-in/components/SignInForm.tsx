import React, { FC, PropsWithoutRef } from 'react';
import { Formik } from 'formik';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Button, TextField } from '../../../components';
import { color, spacing, typography } from '../../../theme';
import { useStores } from '../../../models';

const PHONE_NUMBER_STYLE: TextStyle = {
  borderRadius: 10,
  color: color.palette.black,
  padding: spacing[3],
  marginBottom: spacing[5],
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

export const SignInForm: FC<PropsWithoutRef<{ next: (redirectionUrl: string) => void }>> = props => {
  const { signInStore } = useStores();
  const { next } = props;

  return (
    <Formik
      initialValues={{ phoneNumber: '' }}
      onSubmit={async ({ phoneNumber }) => {
        await signInStore.signIn(phoneNumber);
        const { redirectionUrl } = signInStore;
        next(redirectionUrl);
      }}
    >
      {({ handleSubmit, handleChange, handleBlur }) => (
        <View>
          <TextField
            inputStyle={PHONE_NUMBER_STYLE}
            placeholderTx='signInScreen.hint'
            keyboardType='phone-pad'
            labelTx='signInScreen.labels.phoneNumber'
            onChangeText={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
          />
          <Button testID='next-screen-button' style={[CONTINUE]} textStyle={CONTINUE_TEXT} tx='signInScreen.confirm' onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};
