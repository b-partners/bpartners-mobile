import {LegalFileStoreModel} from './legal-file-store';

test('can be created', () => {
  const instance = LegalFileStoreModel.create({name: "legalFile", id: "id1", approvalDatetime: "", fileUrl: ""});

  expect(instance).toBeTruthy();
});
