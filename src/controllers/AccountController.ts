import { Request, Response } from 'express'

import Controller from './Controller'

import AccountServices from '../services/AccountServices'

import {
  GetAccountRequest,
  Statement,
  Account
} from '../@types'

const accountServices = new AccountServices()

class AccountController extends Controller
{
  findAll(req: Request, res: Response): Response
  {
    const accounts = accountServices.findAll()
    return res.json({ error: null, result: accounts })
  }

  findOne(req: Request, res: Response): Response
  {
    return super.tryCatch(() => {
      const { id } = req.params
      const account = accountServices.findOne<string>({ attrName: 'id', attrValue: id }) as Account

      return account
    }, res, 200)
  }

  create(req: Request, res: Response): void
  {
    const { cpf, name } = req.body
    accountServices.create({ cpf, name })
    
    return res.status(201).end()
  }

  update(req: GetAccountRequest, res: Response): void
  {
    super.tryCatch(() => {
      const account = req.account as Account 
      const { name } = req.body as Partial<Account>

      accountServices.update({ name }, account)
    }, res, 204)
  }

  delete(req: GetAccountRequest, res: Response): void
  {
    super.tryCatch(() => {
      const account = req.account as Account
      accountServices.delete(account)
    }, res, 204)
  }

  getStatement(req: GetAccountRequest, res: Response): Response
  {
    let { statement } = req.account
    const { date } = req.query as { date: string }

    if(date) statement = accountServices.orderByDate({ date, statement })

    return res.json({ error: null, result: statement })
  }

  getBalance(req: GetAccountRequest, res: Response): void
  {
    super.tryCatch(() => {
      const account = req.account as Account
  
      const balance = accountServices.getBalance(account)
      return balance
    }, res, 200)
  }

  deposit(req: GetAccountRequest, res: Response): void
  {
    const { amount, description } = req.body
    const account = req.account as Account

    const statementOperation: Statement = {
      description,
      amount: Number(amount),
      created_at: new Date().toString(),
      type: 'credit'
    }
    
    accountServices.deposit(statementOperation, account)
    return res.status(201).end()
  }
  
  withdraw(req: GetAccountRequest, res: Response): void
  {
    const { amount, description } = req.body
    const account = req.account as Account

    const statementOperation: Statement = {
      description,
      amount: Number(amount),
      created_at: new Date().toString(),
      type: 'debit'
    }

    accountServices.withdraw(statementOperation, account)
    return res.status(201).end()
  }
}

export default AccountController