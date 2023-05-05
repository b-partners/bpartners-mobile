import { LegalFileModel } from './legal-file';

test('can be created', () => {
  const instance = LegalFileModel.create({
    id: 'id1',
    name: 'legalFile1',
    approvalDatetime: '2022-01-16',
    fileUrl: 'SOME_URL',
  });

  expect(instance).toBeTruthy();
});
