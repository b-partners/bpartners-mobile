import uuid from 'react-native-uuid';

import { AccountHolderModel } from './account-holder';

test('can be created', () => {
  const instance = AccountHolderModel.create({
    id: uuid.v4().toString(),
    name: 'Lorem',
  });

  expect(instance).toBeTruthy();
});
