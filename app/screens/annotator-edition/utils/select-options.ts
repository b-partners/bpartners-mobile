import { Wearness } from '../../../models/entities/annotation-metadata/annotation-metadata';

export const labelTypes = [
  { label: 'Toit', value: 'Roof' },
  { label: 'Velux', value: 'Velux' },
];

type WearnessOption = {
  label: string;
  value: Wearness;
};

export const wearnessOptions: WearnessOption[] = [
  { label: '1. Minime', value: Wearness.LOW },
  { label: '2. Partielle', value: Wearness.PARTIAL },
  { label: '3. Avancée', value: Wearness.ADVANCED },
  { label: '4. Extrême', value: Wearness.EXTREME },
];

export const rangeOptions = [...Array(11)].map((_, i) => ({
  value: i * 10,
  label: `${i * 10}`,
}));
