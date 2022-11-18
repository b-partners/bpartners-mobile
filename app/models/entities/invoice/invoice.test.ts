import {InvoiceModel, InvoiceStatus} from './invoice';

test('can be created', () => {
  const instance = InvoiceModel.create({
    id: '',
    fileId: '',
    ref: '',
    title: '',
    customer: {},
    products: [],
    paymentUrl: '',
    status: InvoiceStatus.CONFIRMED,
    toPayAt: null,
    sendingDate: null,
    totalVat: 0,
    totalPriceWithoutVat: 0,
    totalPriceWithVat: 0,
  });

  expect(instance).toBeTruthy();
});
