import { LegalFileStoreModel } from './legal-file-store';

test('can be created', () => {
  const instance = LegalFileStoreModel.create([
    { name: 'legalFile', id: 'id1', approvalDatetime: '', fileUrl: '' },
    { name: null, id: null, approvalDatetime: null, fileUrl: null },
    { name: undefined, id: undefined, approvalDatetime: undefined, fileUrl: undefined },
  ]);
  expect(instance).toBeTruthy();
});
