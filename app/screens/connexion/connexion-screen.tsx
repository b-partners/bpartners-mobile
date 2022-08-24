import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { color, spacing, typography } from '../../theme';
import { NavigatorParamList } from '../../navigators';
import { Button, GradientBackground, Header, Screen, Text, TextField } from '../../components';

const FULL: ViewStyle = {
  flex: 1,
};
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};

const BOLD: TextStyle = { fontWeight: 'bold' };

const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
};

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

let CONTENT: TextStyle = {
  ...TEXT,
  color: '#BAB6C8',
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
};
const HEADER: ViewStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
};
const CONTAINER: ViewStyle = {
  paddingHorizontal: spacing[4],
};
const styles = StyleSheet.create({
  phoneInput: {
    borderRadius: 10,
    color: color.palette.black,
    padding: spacing[3],
    marginBottom: spacing[5],
  },
});
const DISABLE = { opacity: 0.6 };

export const ConnexionScreen: FC<StackScreenProps<NavigatorParamList, 'connexion'>> = observer(({ navigation }) => {
  const goBack = () => navigation.goBack();

  const [phoneNumber, setPhoneNumber] = useState('');

  const handleChange = (phone: string) => {
    setPhoneNumber(phone);
  };

  const handlePress = () => {
    // TODO api call
  };

  return (
    <View testID='ConnexionScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='scroll' backgroundColor={color.transparent}>
        <Header leftIcon='back' onLeftPress={goBack} style={HEADER} />
        <View>
          <Text style={TITLE} preset='header' tx='connexionScreen.title' />
          <Text tx='connexionScreen.description' style={CONTENT} />
          <TextField
            inputStyle={styles.phoneInput}
            placeholderTx='connexionScreen.hint'
            keyboardType='phone-pad'
            label='Phone number'
            onChangeText={newValue => handleChange(newValue)}
          />

          <View style={phoneNumber.length !== 10 && phoneNumber.length !== 9 && DISABLE}>
            <Button
              testID='next-screen-button'
              style={[CONTINUE]}
              textStyle={CONTINUE_TEXT}
              tx='connexionScreen.confirm'
              onPress={handlePress}
              disabled={phoneNumber.length <= 10}
            />
          </View>
        </View>
      </Screen>
    </View>
  );
});
