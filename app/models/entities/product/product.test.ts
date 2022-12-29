import uuid from 'react-native-uuid';

import { ProductModel } from './product';

test('can be created', () => {
  const instance = ProductModel.create({
    id: uuid.v4() as string,
    description: 'Lorem',
    quantity: 0,
    unitPrice: 0,
    vatPercent: 0,
    totalVat: 0,
    totalPriceWithVat: 0,
  });

  expect(instance).toBeTruthy();
});
