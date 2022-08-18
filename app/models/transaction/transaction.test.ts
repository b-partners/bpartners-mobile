import { TransactionModel } from './transaction';

test('can be created', () => {
  const instance = TransactionModel.create({
    id: 1,
    amount: 1000,
    paymentReqId: 1,
    updateDateTime: new Date(),
  });

  expect(instance).toBeTruthy();
});
