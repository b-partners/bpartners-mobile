import { OnboardingStoreModel } from './onboarding-store';

test('can be created', () => {
  const instance = OnboardingStoreModel.create({});

  expect(instance).toBeTruthy();
});
