import uuid from 'react-native-uuid';

import { CustomerModel } from './customer';

test('can be created', () => {
  const instance = CustomerModel.create({
    id: uuid.v4() as string,
    name: 'Lorem',
    email: 'test@test.test',
    phone: '+1231231212312',
    address: 'Lorem',
  });

  expect(instance).toBeTruthy();
});
