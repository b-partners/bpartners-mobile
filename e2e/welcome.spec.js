const { reloadApp } = require('./reload');

describe('Welcome', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('WelcomeScreen'))).toBeVisible();
  });

  it('Should go to sign in screen', async () => {
    await element(by.id('sign-in-button')).tap();
    await expect(element(by.id('SignInScreen'))).toBeVisible();
  });

  it('Should go to onboarding screen', async () => {
    await element(by.id('header-left-button')).tap();
    await element(by.id('onboarding-button')).tap();
    await expect(element(by.id('OnboardingScreen'))).toBeVisible();
  });
});
