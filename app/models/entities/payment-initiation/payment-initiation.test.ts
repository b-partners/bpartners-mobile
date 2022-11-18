import uuid from 'react-native-uuid';

import { PaymentInitiationModel } from './payment-initiation';

test('can be created', () => {
  const instance = PaymentInitiationModel.create({
    id: uuid.v4() as string,
    label: null,
    amount: 1,
    payerName: "Lorem",
    payerEmail: null
  });

  expect(instance).toBeTruthy();
});
