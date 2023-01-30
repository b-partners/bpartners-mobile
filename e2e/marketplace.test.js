let device;

describe('Transaction', () => {
  beforeAll(async () => {
    await device.launchApp();
    device = device.getPlatform();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays transaction list', async () => {
    await waitFor(element(by.id('menuContainer')));
    await element(by.id('menuContainer')).tap();
    await element(by.id('marketplace')).tap();
    await waitFor(element(by.id('marketplace-screen')))
      .toBeVisible()
      .withTimeout(5_000);
    await waitFor(element(by.id('marketplace-list-container')))
      .toBeVisible()
      .withTimeout(5_000);
  });
});
