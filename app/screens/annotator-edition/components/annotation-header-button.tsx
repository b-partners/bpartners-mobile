import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { palette } from '../../../theme/palette';

const zoomInProps: IconSource = {
  source: MaterialIcons.getImageSourceSync('zoom-in'),
  direction: 'auto',
};

const pictureProps: IconSource = {
  source: AntDesign.getImageSourceSync('picture'),
  direction: 'auto',
};

const zoomOutMap: IconSource = {
  source: MaterialIcons.getImageSourceSync('zoom-out-map'),
  direction: 'auto',
};

export const AnnotationHeaderButtons = () => {
  const handleOpen = () => console.log('here');
  return (
    <View style={{ marginVertical: 5 }}>
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 5,
          margin: 'auto',
        }}
      >
        <Button buttonColor={palette.lighterPurple} textColor={palette.white} icon={zoomInProps} mode='contained' onPress={handleOpen}>
          Niveau de zoom
        </Button>
        <Button buttonColor={palette.lighterPurple} textColor={palette.white} icon={pictureProps} mode='contained' onPress={handleOpen}>
          Source d'image
        </Button>
        <Button buttonColor={palette.lighterPurple} textColor={palette.white} icon={zoomOutMap} mode='contained' onPress={handleOpen}>
          Recenter l'image
        </Button>
      </ScrollView>
    </View>
  );
};
