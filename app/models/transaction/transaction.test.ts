import { TransactionModel } from './transaction';

test('can be created', () => {
  const instance = TransactionModel.create({
    id: '',
    label: '',
    reference: '',
    amount: 0,
    category: null,
    paymentDatetime: '',
  });

  expect(instance).toBeTruthy();
});
