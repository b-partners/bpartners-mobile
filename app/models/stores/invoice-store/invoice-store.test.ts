import { InvoiceStoreModel } from './invoice-store';

test('can be created', () => {
  const instance = InvoiceStoreModel.create({});

  expect(instance).toBeTruthy();
});
