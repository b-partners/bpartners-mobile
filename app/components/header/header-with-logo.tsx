import React, { FC, useEffect } from 'react';
import { ImageStyle } from 'react-native';

import { useStores } from '../../models';
import { Logo } from '../../screens/transaction-summary/components/logo';
import { Header, HeaderProps } from './header';

export const HeaderWithLogo: FC<Omit<HeaderProps, 'leftIcon' | 'leftContent'> & { imageStyle?: ImageStyle }> = ({ children, imageStyle = {}, ...props }) => {
  const {
    authStore: { currentUser },
    fileStore,
  } = useStores();
  const { fileUrl } = fileStore;

  useEffect(() => {
    const fetchFileUrl = async () => {
      await fileStore.getFileUrl(currentUser.logoFileId);
    };
    fetchFileUrl();
  }, []);

  return (
    <Header
      leftContent={<Logo uri={fileUrl} imageStyle={{ ...imageStyle, borderRadius: 50 }} logoStyle={{ width: 50, height: 50 }} testID={'craftsmanLogo'} />}
      {...props}
    >
      {children}
    </Header>
  );
};
