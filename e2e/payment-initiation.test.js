import { by, device, element, waitFor } from 'detox';

describe('PaymentInitiation', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Initiating a payment', async () => {
    const REF = `REF-${new Date().toISOString().replaceAll('-', '')}`;
    await waitFor(element(by.id('paymentInitiationTab')));
    try {
      await element(by.id('paymentInitiationTab')).tap();
      await waitFor(element(by.id('paymentInitiationScreen'))).toBeVisible();
      await element(by.id('reference')).typeText(REF);
      await element(by.id('label')).typeText(`TEST-${REF}`);
      await element(by.id('amount')).typeText('10');
      await element(by.id('clientName')).typeText('Joe Doe');
      await element(by.id('clientEmail')).typeText('joe.doe@test.com');
      await element(by.id('submit')).tap();
    } catch (e) {}
    await waitFor(element(by.id('payment-url'))).toBeVisible();
  });

  it('Amount must be a number', async () => {
    const REF = `REF-${new Date().toISOString().replaceAll('-', '')}`;
    await waitFor(element(by.id('paymentInitiationTab')));
    try {
      await element(by.id('paymentInitiationTab')).tap();
      await waitFor(element(by.id('paymentInitiationScreen')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('reference')).typeText(REF);
      await element(by.id('label')).typeText(`TEST-${REF}`);
      await element(by.id('amount')).typeText('Test');
      await element(by.id('clientName')).typeText('Joe Doe');
      await element(by.id('clientEmail')).typeText('joe.doe@test.com');
      await element(by.id('submit')).tap();
    } catch (e) {}
    await waitFor(element(by.id('amount-error-message'))).toBeVisible();
  });

  it('Email must be a valid email', async () => {
    const REF = `REF-${new Date().toISOString().replaceAll('-', '')}`;
    await waitFor(element(by.id('paymentInitiationTab')));
    try {
      await element(by.id('paymentInitiationTab')).tap();
      await waitFor(element(by.id('paymentInitiationScreen')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('reference')).typeText(REF);
      await element(by.id('label')).typeText(`TEST-${REF}`);
      await element(by.id('amount')).typeText('10');
      await element(by.id('clientName')).typeText('Joe Doe');
      await element(by.id('clientEmail')).typeText('Test email');
      await element(by.id('submit')).tap();
    } catch (e) {}
    await waitFor(element(by.id('payerEmail-error-message'))).toBeVisible();
  });
});
