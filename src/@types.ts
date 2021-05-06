import { Request, Response } from 'express'

interface Database { accounts: Array<Account> }
interface GetAccountRequest extends Request { account: Account }

type MiddlewareReturn = Response | void

interface Statement {
  description: string
  amount: number
  created_at: string
  type: 'credit' | 'debit'
}

interface Account {
  name: string
  id: string
  cpf: string
  statement: Statement[]
}

export { Database, Account, Statement, MiddlewareReturn, GetAccountRequest }