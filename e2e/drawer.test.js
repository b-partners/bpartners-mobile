import { by, device, element, waitFor } from 'detox';

describe('Drawer', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays correct label', async () => {
    await waitFor(element(by.id('menuContainer')));
    try {
      await element(by.id('menuContainer')).tap();
    } catch (e) {}
    await waitFor(element(by.id('homeText'))).toBeVisible();
    await waitFor(element(by.id('profileText'))).toBeVisible();
    await waitFor(element(by.id('transactionListText'))).toBeVisible();
    await waitFor(element(by.id('customerText'))).toBeVisible();
    await waitFor(element(by.id('productText'))).toBeVisible();
    await waitFor(element(by.id('bankText'))).toBeVisible();
    await waitFor(element(by.id('partnersText'))).toBeVisible();
  });
});
