import { PaymentInitiationModel } from './payment-initiation';
import uuid from 'react-native-uuid';

test('can be created', () => {
  const instance = PaymentInitiationModel.create({
    id: uuid.v4() as string,
    label: null,
    amount: 1,
    payerName: 'Lorem',
    payerEmail: null,
  });

  expect(instance).toBeTruthy();
});
