import { AccountHolderModel } from './account-holder';
import uuid from 'react-native-uuid';

test('can be created', () => {
  const instance = AccountHolderModel.create({
    id: uuid.v4() as string,
    name: 'Lorem',
    address: '',
    city: '',
    country: 'France',
    postalCode: '75',
  });

  expect(instance).toBeTruthy();
});
