import { BusinessActivityModel } from './business-activity';

test('can be created', () => {
  const instance = BusinessActivityModel.create({
    primary: 'agenceur',
    secondary: "architecte"
  });

  expect(instance).toBeTruthy();
});
