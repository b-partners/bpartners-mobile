import { CriteriaModel } from './criteria';
import uuid from 'react-native-uuid';

test('can be created', () => {
  const instance = CriteriaModel.create({
    id: uuid.v4() as string,
    name: 'Lorem',
    BIC: 'CCBPFRPPTLS',
    IBAN: 'FR6414508000406328997474V02',
  });

  expect(instance).toBeTruthy();
});
