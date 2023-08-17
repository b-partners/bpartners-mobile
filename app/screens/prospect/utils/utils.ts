import React from 'react';

import { MenuItem } from '../../../components';
import { Prospect } from '../../../models/entities/prospect/prospect';

export type ProspectItemProps = {
  menuItem: MenuItem[];
  prospect: Prospect;
  ahId: string;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  key: number;
};

export const geojsonBaseurl = 'http://geojson.io';
