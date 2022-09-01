import { TransactionModel } from './transaction';

test('can be created', () => {
  const instance = TransactionModel.create({
    id: 1,
    label: null,
    reference: null,
    amount: null,
    category: null,
    swanTransactionId: null,
    paymentDateTime: null,
  });

  expect(instance).toBeTruthy();
});
