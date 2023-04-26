import React, { ReactNode, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface Props {
  children: ReactNode;
}

const KeyboardAvoidingWrapper: React.FC<Props> = ({ children }) => {
  const [didKeyboardShow, setKeyboardShow] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardShow(false);
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={didKeyboardShow ? styles.keyboardOn : styles.keyboardOff}>
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;

const styles = StyleSheet.create({
  keyboardOn: {
    position: 'relative',
    bottom: Platform.OS == 'android' ? '45%' : '20%',
  },
  keyboardOff: {
    marginVertical: 0,
  },
});
