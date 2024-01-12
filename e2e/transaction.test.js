import { by, device, element, waitFor } from 'detox';

describe('Transaction', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays latest transaction', async () => {
    await waitFor(element(by.id('homeScreen')));
    await waitFor(element(by.id('latestTransactionText'))).toBeVisible();
  });

  it('displays transaction list', async () => {
    await waitFor(element(by.id('menuContainer')));
    try {
      await element(by.id('menuContainer')).tap();
      await element(by.id('transactionList')).tap();
    } catch (e) {}

    await waitFor(element(by.id('TransactionListScreen'))).toBeVisible();
    await waitFor(element(by.id('listContainer'))).toBeVisible();
  });
});
