import React from 'react';

import { Event } from '../../../models/entities/calendar/calendar';

export interface SynchronizeModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EventModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentEvent: Event;
  isEditing: boolean;
}

export interface EventsModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: string;
  events: Event[];
}

export interface EventCardProps {
  date: string;
  dateName: string;
  time: string;
  title: string;
}

export interface AgendaItemProps {
  item: Event;
  onSelectEvent: (item: Event) => void;
}

export interface ParticipantItemProps {
  email: string;
  onDelete: (item: string) => void;
}
