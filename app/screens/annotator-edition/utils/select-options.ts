import { Wearness } from '../../../models/entities/annotation-metadata/annotation-metadata';
import Pente1 from '../assets/slopes/pente1.png';
import Pente2 from '../assets/slopes/pente2.png';
import Pente3 from '../assets/slopes/pente3.png';
import Pente4 from '../assets/slopes/pente4.png';
import Pente5 from '../assets/slopes/pente5.png';
import Pente6 from '../assets/slopes/pente6.png';
import Pente7 from '../assets/slopes/pente7.png';
import Pente8 from '../assets/slopes/pente8.png';
import Pente9 from '../assets/slopes/pente9.png';
import Pente10 from '../assets/slopes/pente10.png';
import Pente11 from '../assets/slopes/pente11.png';
import Pente12 from '../assets/slopes/pente12.png';
import Pente13 from '../assets/slopes/pente13.png';
import Pente14 from '../assets/slopes/pente14.png';
import Pente15 from '../assets/slopes/pente15.png';
import Pente16 from '../assets/slopes/pente16.png';
import Pente17 from '../assets/slopes/pente17.png';
import Pente18 from '../assets/slopes/pente18.png';

type SelectOption = {
  label: string;
  value: string;
};

type WearnessOption = {
  label: string;
  value: Wearness;
};

export const labelTypes = [
  { label: 'Toit', value: 'Roof' },
  { label: 'Velux', value: 'Velux' },
];

export const wearnessOptions: WearnessOption[] = [
  { label: '1. Minime', value: Wearness.LOW },
  { label: '2. Partielle', value: Wearness.PARTIAL },
  { label: '3. Avancée', value: Wearness.ADVANCED },
  { label: '4. Extrême', value: Wearness.EXTREME },
];

export const coveringOptions: SelectOption[] = [
  { label: 'Tuiles', value: 'Tiles' },
  { label: 'Ardoise', value: 'Slate' },
  { label: 'Beton', value: 'Concrete' },
  { label: 'Autre', value: 'Other' },
];

export const rangeOptions = [...Array(11)].map((_, i) => ({
  value: i * 10,
  label: `${i * 10}`,
}));

export const slopeOptions = [
  { label: '1/12', value: '1', image: Pente1 },
  { label: '2/12', value: '2', image: Pente2 },
  { label: '3/12', value: '3', image: Pente3 },
  { label: '4/12', value: '4', image: Pente4 },
  { label: '5/12', value: '5', image: Pente5 },
  { label: '6/12', value: '6', image: Pente6 },
  { label: '7/12', value: '7', image: Pente7 },
  { label: '8/12', value: '8', image: Pente8 },
  { label: '9/12', value: '9', image: Pente9 },
  { label: '10/12', value: '10', image: Pente10 },
  { label: '11/12', value: '11', image: Pente11 },
  { label: '12/12', value: '12', image: Pente12 },
  { label: '13/12', value: '13', image: Pente13 },
  { label: '14/12', value: '14', image: Pente14 },
  { label: '15/12', value: '15', image: Pente15 },
  { label: '16/12', value: '16', image: Pente16 },
  { label: '17/12', value: '17', image: Pente17 },
  { label: '18/12', value: '18', image: Pente18 },
];
