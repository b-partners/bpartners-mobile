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

export type ProcessModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  prospect: Prospect;
};

export enum ProspectEnum {
  NOT_INTERESTED = 'NOT_INTERESTED',
  INTERESTED = 'INTERESTED',
  QUOTATION_SENT = 'QUOTATION_SENT',
  ACCEPTED_QUOTATION = 'ACCEPTED_QUOTATION',
  REFUSED_QUOTATION = 'REFUSED_QUOTATION',
  INVOICE_SENT = 'INVOICE_SENT',
}

export const geojsonBaseurl = 'http://geojson.io';
