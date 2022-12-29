import uuid from 'react-native-uuid';

import { AccountModel } from './account';

test('can be created', () => {
  const instance = AccountModel.create({
    id: uuid.v4() as string,
    name: 'Lorem',
    BIC: 'CCBPFRPPTLS',
    IBAN: 'FR6414508000406328997474V02',
  });

  expect(instance).toBeTruthy();
});
