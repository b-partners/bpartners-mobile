import { PaymentInitiationStoreModel } from './payment-initiation-store';

test('can be created', () => {
  const instance = PaymentInitiationStoreModel.create({});

  expect(instance).toBeTruthy();
});
