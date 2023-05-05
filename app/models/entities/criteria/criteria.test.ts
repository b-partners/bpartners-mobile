import { CriteriaModel } from './criteria';

test('can be created', () => {
  const instance = CriteriaModel.create({
    page: 1,
    pageSize: 1,
    status: null,
  });

  expect(instance).toBeTruthy();
});
