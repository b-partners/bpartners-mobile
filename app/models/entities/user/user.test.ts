import uuid from 'react-native-uuid';

import { UserModel } from './user';

test('can be created', () => {
  const instance = UserModel.create({
    id: uuid.v4() as string,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date().toISOString(),
    identificationStatus: '',
    idVerified: true,
    logoFileId: '',
    monthlySubscriptionAmount: 1000,
    phone: '',
    status: '',
    nationalityCCA3: '',
  });

  expect(instance).toBeTruthy();
});
