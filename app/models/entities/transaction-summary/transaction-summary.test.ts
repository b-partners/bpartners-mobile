import { TransactionSummaryModel } from './transaction-summary';

test('can be created', () => {
  const instance = TransactionSummaryModel.create({
    id: '1',
    userDefined: false,
    type: '',
    vat: 0,
  });

  expect(instance).toBeTruthy();
});
