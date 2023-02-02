describe('Marketplace', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays marketplace list', async () => {
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
