import React from 'react';

export interface SynchronizeModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EventsModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EventCardProps {
  date: string;
  dateName: string;
  time: string;
  title: string;
}
