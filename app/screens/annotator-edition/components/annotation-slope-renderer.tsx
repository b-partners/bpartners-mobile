import React from 'react';

import { AutoImage } from '../../../components';
import { annotatorSlopeImageList, slopeRendererStyle as style } from '../utils';

export const slopeRenderer = (item: (typeof annotatorSlopeImageList)[0]) => {
  return <AutoImage style={style.image} source={item.link} />;
};
