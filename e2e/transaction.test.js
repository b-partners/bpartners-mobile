describe('Transaction', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays transaction list', async () => {
    await waitFor(element(by.id('menuContainer')));
    await element(by.id('menuContainer')).tap();
    await element(by.id('transactionList')).tap();
    await waitFor(element(by.id('TransactionListScreen')))
      .toBeVisible()
      .withTimeout(5_000);
    await waitFor(element(by.id('listContainer')))
      .toBeVisible()
      .withTimeout(5_000);
  });
});
