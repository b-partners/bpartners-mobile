import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import RBSheet from 'react-native-raw-bottom-sheet';
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
  const refRBSheet = useRef<any>(null);

  const handleOpen = () => refRBSheet.current.open();

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
      <RBSheet ref={refRBSheet} draggable={true} dragOnContent={true} height={400}>
        <View style={{ padding: 10 }}>
          <RadioButton.Group onValueChange={() => {}} value='19'>
            <RadioButton.Item color={palette.mulberry} label='Quartier' value='19' />
            <RadioButton.Item color={palette.mulberry} label='Parcelle cadastrale' value='20' />
            <RadioButton.Item color={palette.mulberry} label='Toiture' value='23' />
          </RadioButton.Group>
        </View>
      </RBSheet>
    </View>
  );
};
