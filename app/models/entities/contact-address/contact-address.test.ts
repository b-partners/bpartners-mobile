import { ContactAddressModel } from './contact-address';

test('can be created', () => {
  const instance = ContactAddressModel.create({
    address: '6 RUE PAUL LANGEVIN',
    city: 'FONTENAY-SOUS-BOIS',
    country: 'FRANCE',
    postalCode: '94120'
  });

  expect(instance).toBeTruthy();
});
