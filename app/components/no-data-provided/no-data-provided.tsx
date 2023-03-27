import React from 'react';
import { View } from 'react-native';
import FileIcon from 'react-native-vector-icons/FontAwesome5';

import { Text } from '../text/text';

export function NoDataProvided() {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          marginTop: 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'transparent',
          borderRadius: 70,
          backgroundColor: '#EEF0F4',
          height: 70,
          width: 70,
          margin: 'auto',
        }}
      >
        <FileIcon name='file-invoice' size={38} color='#D3D9DD' />
      </View>
      <Text
        tx={'common.noDataProvided'}
        style={{
          color: '#808080',
          marginTop: 16,
          fontSize: 13,
        }}
      />
    </View>
  );
}
