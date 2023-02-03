describe('Drawer', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays correct label', async () => {
    await waitFor(element(by.id('menuContainer')));
    await element(by.id('menuContainer')).tap();
    await expect(element(by.id('homeText'))).toHaveText('Accueil');
    await expect(element(by.id('profileText'))).toHaveText('Profil');
    await expect(element(by.id('transactionListText'))).toHaveText('Transactions');
    await expect(element(by.id('supportContactText'))).toHaveText('Contacter le support');
    await expect(element(by.id('openSwanText'))).toHaveText('Ouvrir Swan');
  });
});
