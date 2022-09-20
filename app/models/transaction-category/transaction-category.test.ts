import { TransactionCategoryModel } from './transaction-category';

test('can be created', () => {
  const instance = TransactionCategoryModel.create({
    id: '1',
    userDefined: false,
    type: '',
    vat: 0,
  });

  expect(instance).toBeTruthy();
});
