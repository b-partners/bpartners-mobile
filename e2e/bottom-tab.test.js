import { by, device, element, waitFor } from 'detox';

describe('Bottom-tab', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('display correct label', async () => {
    await waitFor(element(by.id('bottom-tab'))).toBeVisible();
    await waitFor(element(by.id('homeTab'))).toBeVisible();
    await waitFor(element(by.id('marketplaceTab'))).toBeVisible();
    await waitFor(element(by.id('paymentInitiationTab'))).toBeVisible();
    await waitFor(element(by.id('paymentListTab'))).toBeVisible();
    await waitFor(element(by.id('supportContactTab'))).toBeVisible();
  });

  it('show Modal', async () => {
    await waitFor(element(by.id('serviceTab'))).toBeVisible();
    try {
      await element(by.id('serviceTab')).tap(); //all actions are available only for API31 based simulators
    } catch (e) {}
    await waitFor(element(by.id('BottomTabModal'))).toBeVisible();
  });
});
