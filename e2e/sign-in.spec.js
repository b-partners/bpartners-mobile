const { reloadApp } = require('./reload');

describe('Sign in', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('should redirect to swan', async () => {
    await element(by.id('sign-in-button')).tap();
    await element(by.id('phone-number')).typeText('+261340465338');
    await element(by.id('submit-button')).tap();
    await expect(element(by.id('SignInWebViewScreen'))).toBeVisible();
  });

  it('should display form validation error', async () => {
    await element(by.id('sign-in-button')).tap();
    await element(by.id('phone-number')).typeText('lorem');
    await element(by.id('submit-button')).tap();
    await expect(element(by.id('error-message'))).toBeVisible();
  });
});
