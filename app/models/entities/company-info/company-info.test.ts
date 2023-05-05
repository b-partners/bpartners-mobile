import { CompanyInfoModel } from './company-info';

test('can be created', () => {
  const instance = CompanyInfoModel.create({
    socialCapital: 0,
  });

  expect(instance).toBeTruthy();
});
