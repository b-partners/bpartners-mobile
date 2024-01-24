import { by, device, element, waitFor } from 'detox';

describe('Marketplace', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays marketplace list', async () => {
    await waitFor(element(by.id('marketplaceTab')));
    try {
      await element(by.id('marketplaceTab')).tap();
    } catch (e) {}
    await waitFor(element(by.id('marketplaceScreen'))).toBeVisible();
    await waitFor(element(by.id('marketplace-list-container'))).toBeVisible();
  });
});
