import { ProductStoreModel } from './product-store';

test('can be created', () => {
  const instance = ProductStoreModel.create({});

  expect(instance).toBeTruthy();
});
