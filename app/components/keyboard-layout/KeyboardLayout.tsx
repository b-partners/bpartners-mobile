import React, { useEffect } from 'react';
import { Keyboard } from 'react-native';

interface KeyboardLayoutProps {
  children: React.ReactNode;
  setKeyboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KeyboardLayout: React.FC<KeyboardLayoutProps> = props => {
  const { children, setKeyboardOpen } = props;
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return <>{children}</>;
};
