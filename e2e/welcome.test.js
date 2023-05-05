describe('App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('can view balance', async () => {
    await waitFor(element(by.id('balance-view')))
      .toBeVisible()
      .withTimeout(5_000);
  });
});
