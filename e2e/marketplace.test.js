describe('Marketplace', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays marketplace list', async () => {
    await waitFor(element(by.id('marketplaceTab')));
    await element(by.id('marketplaceTab')).tap();
    await waitFor(element(by.id('marketplaceScreen')))
      .toBeVisible()
      .withTimeout(5_000);
    await waitFor(element(by.id('marketplace-list-container')))
      .toBeVisible()
      .withTimeout(5_000);
  });
});
