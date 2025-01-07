import { Point } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import MuiIcon from 'react-native-vector-icons/MaterialIcons';

import { palette } from '../../../theme/palette';
import { IMAGE_MARGIN_HALF } from '../utils';

interface AnnotationMarkerRendererProps {
  marker: Point;
  scale: number;
}

export const AnnotationMarkerRenderer: FC<AnnotationMarkerRendererProps> = ({ marker, scale }) => {
  return (
    <MuiIcon
      name='location-on'
      style={{
        position: 'absolute',
        top: (marker.y + IMAGE_MARGIN_HALF) * scale,
        left: (marker.x + IMAGE_MARGIN_HALF) * scale,
        transform: [{ translateX: '-50%' }, { translateY: '-100%' }],
      }}
      size={20}
      color={palette.red}
    />
  );
};
