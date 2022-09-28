import { CustomerStoreModel } from './customer-store';

test('can be created', () => {
  const instance = CustomerStoreModel.create({});

  expect(instance).toBeTruthy();
});
