import { SignInStoreModel } from './sign-in-store';

test('can be created', () => {
  const instance = SignInStoreModel.create({});

  expect(instance).toBeTruthy();
});
