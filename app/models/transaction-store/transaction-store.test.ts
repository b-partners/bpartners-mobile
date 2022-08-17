import { TransactionStoreModel } from "./transaction-store"

test("can be created", () => {
  const instance = TransactionStoreModel.create({})

  expect(instance).toBeTruthy()
})
