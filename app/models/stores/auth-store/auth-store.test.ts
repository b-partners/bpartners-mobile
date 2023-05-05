import { AuthStoreModel } from './auth-store';

test('can be created', () => {
  const instance = AuthStoreModel.create({});

  expect(instance).toBeTruthy();
});

test('can be re-initialised with default values', () => {
  const instance = AuthStoreModel.create({
    redirectionUrl: 'redirectionUrl',
    successUrl: 'successUrl',
    failureUrl: 'failureUrl',
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
    currentUser: {},
    currentAccount: {},
    currentAccountHolder: {},
  });

  const expected = AuthStoreModel.create({
    redirectionUrl: '',
    successUrl: '',
    failureUrl: '',
    refreshToken: '',
    accessToken: '',
    currentUser: {},
    currentAccount: {},
    currentAccountHolder: {},
  });
  instance.reset();

  expect(instance).toStrictEqual(expected);
});
