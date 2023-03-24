import { RevenueTargetModel } from './revenue-target';

test('can be created', () => {
  const instance = RevenueTargetModel.create({
    year: 0,
    amountTarget: 0,
    amountAttempted: 0,
    amountAttemptedPercent: 0,
    updatedAt: '2023-03-13T06:35:35.756Z',
  });

  expect(instance).toBeTruthy();
});
