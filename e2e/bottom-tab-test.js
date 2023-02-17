describe('Drawer', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays correct label', async () => {
    await waitFor(element(by.id('bottom-tab')));
  });
});
