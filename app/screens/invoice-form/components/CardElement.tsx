import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../styles';
import GridHeaderContent from './grid-header-content';

function CardElement(props) {
  return (
    <>
      <View style={{ backgroundColor: palette.white, borderRadius: 20, margin: spacing[4], overflow: 'hidden', ...SHADOW_STYLE }}>
        <GridHeaderContent headerText={"Titre de l'élement"} bodyText={'Réparation de la plomberie'} />
        <GridHeaderContent headerText={'Déscription (facultatif)'} bodyText={'Changement du tuyau'} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', overflow: 'hidden' }}>
          <GridHeaderContent headerText={'Prix unit'} bodyText={'0.0$'} style={{ borderWidth: 1, borderColor: palette.lighterGrey, flex: 1 }} />
          <GridHeaderContent headerText={'Quantité'} bodyText={'x1'} style={{ borderWidth: 1, borderColor: palette.lighterGrey, flex: 1 }} />
          <GridHeaderContent headerText={'TVA'} bodyText={'0%'} style={{ borderWidth: 1, borderColor: palette.lighterGrey, flex: 1 }} />
        </View>
      </View>
    </>
  );
}

export default CardElement;
