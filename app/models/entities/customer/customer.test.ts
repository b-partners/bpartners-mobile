import { CustomerModel } from './customer';
import uuid from 'react-native-uuid';

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
