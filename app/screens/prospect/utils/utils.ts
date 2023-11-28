import { MenuItem } from '../../../components';
import { Prospect, ProspectStatus } from '../../../models/entities/prospect/prospect';
import React from 'react';

export type ProspectItemProps = {
  menuItem: MenuItem[];
  prospect: Prospect;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  key: number;
};

export type ProcessModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  prospect: Prospect;
  status: ProspectStatus;
  setStatus: React.Dispatch<React.SetStateAction<ProspectStatus | null>>;
};

export type ProspectCreationModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  status: ProspectStatus;
  setStatus: React.Dispatch<React.SetStateAction<ProspectStatus | null>>;
};

export enum ProspectFeedback {
  NOT_INTERESTED = 'NOT_INTERESTED',
  INTERESTED = 'INTERESTED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_DECLINED = 'PROPOSAL_DECLINED',
  INVOICE_SENT = 'INVOICE_SENT',
}

export const geojsonBaseurl = 'http://geojson.io';
