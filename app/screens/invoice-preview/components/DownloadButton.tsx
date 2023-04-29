import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

import { Loader } from '../../../components';
import { color } from '../../../theme';

const DOWNLOAD_BUTTON_STYLE: ViewStyle = {
  borderWidth: 1,
  width: 48,
  height: 48,
  borderRadius: 24,
  borderColor: color.primary,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#171717',
  shadowOffset: { width: -4, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
};
type TDownloadButton = { onPress: () => Promise<void>; loading: boolean; downloadFinished: boolean; downloadError };

export function DownloadButton(props: TDownloadButton) {
  const { downloadFinished, loading, onPress, downloadError } = props;
  if (loading) {
    return (
      <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE }} onPress={onPress}>
        <Loader size={'small'} color={color.palette.black} />
      </TouchableOpacity>
    );
  }
  if (downloadError) {
    return (
      <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE, backgroundColor: color.palette.angry }} onPress={onPress}>
        <Ionicons name='reload' size={24} color={color.palette.white} />
      </TouchableOpacity>
    );
  }
  if (!loading && downloadFinished) {
    return (
      <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE, backgroundColor: color.primary }} onPress={onPress} disabled={true}>
        <Octicons name='check' size={24} color={color.palette.white} />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE }} onPress={onPress}>
      <AntDesign name='download' size={24} color={color.primary} />
    </TouchableOpacity>
  );
}
