import { InvoiceModel } from './invoice';

test('can be created', () => {
  const instance = InvoiceModel.create({
    id: '',
    fileId: '',
    ref: '',
    title: '',
    customer: {},
    products: [],
    paymentUrl: '',
    status: 'CONFIRMED',
    toPayAt: '',
    sendingDate: '',
    totalVat: 0,
    totalPriceWithoutVat: 0,
    totalPriceWithVat: 0,
  });

  expect(instance).toBeTruthy();
});
