import { GeneralApiProblem } from "./api-problem"
import { Transaction } from "../../models/transaction/transaction"

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetTransactionsResult = { kind: "ok"; transactions: Transaction[] } | GeneralApiProblem
export type GetTransactionResult = { kind: "ok"; transaction: Transaction } | GeneralApiProblem
