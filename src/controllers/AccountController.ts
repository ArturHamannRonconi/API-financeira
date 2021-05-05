import { NextFunction, Request, Response } from 'express'

import Account from '../database/Entities/Account'
import AccountServices from '../Services/AccountServices'
import GetAccountRequest from '../@types/GetAccountRequest'
import Statement from '../@types/Statement'

type MiddlewareReturn = Response | void

const accountServices = new AccountServices()

class AccountController
{

  findAll(req: Request, res: Response): Response
  {
    const accounts = accountServices.findAll()
    return res.json({ error: null, result: accounts })
  }

  findOne(req: Request, res: Response): Response
  {
    try {
      const { id } = req.params
      const account = accountServices.findOne({ id })
    
      return res.json({error: null, result: account})
    } catch (error) {
      const [ statuCode, message ] = error.message.split('/')
      return res.status(statuCode).json({ error: message, result: null })
    }
  }

  verifyAccountAlreadyExists(req: Request, res: Response, next: NextFunction): MiddlewareReturn
  {
    try {
      let cpf: string

      if(req.method === 'POST') cpf = req.body.cpf as string
      if(req.method === 'GET')  cpf = req.params.cpf as string

      accountServices.verifyAccountAlreadyExists({ cpf }, false) 

      return next()
    } catch (error) {
      const [ statuCode, message ] = error.message.split('/')
      return res.status(statuCode).json({ error: message, result: null })
    }
  }
  create(req: Request, res: Response): MiddlewareReturn
  {
    const { cpf, name } = req.body
    accountServices.create({ cpf, name })
    
    return res.status(201).end()
  }

  verifiyExistsAccount(req: GetAccountRequest, res: Response, next: NextFunction): MiddlewareReturn
  {
    try {
      let cpf: string
      
      if(req.method === 'POST') cpf = req.body.cpf as string
      if(req.method === 'GET')  cpf = req.params.cpf as string

      const account = accountServices.verifyAccountAlreadyExists({ cpf }, true) 
      req.account = account as Account

      return next()
    } catch (error) {
      const [ statuCode, message ] = error.message.split('/')
      return res.status(statuCode).json({ error: message, result: null })
    }
  }
  getStatement(req: GetAccountRequest, res: Response): MiddlewareReturn
  {
    return res.json({ error: null, result: req.account.statement })
  }
  deposit(req: GetAccountRequest, res: Response): MiddlewareReturn
  {
    const { amount, description } = req.body
    const account = req.account as Account

    const statementOperation: Statement = {
      description,
      amount,
      created_at: new Date().toString(),
      type: 'credit'
    }
    
    accountServices.deposit(statementOperation, account)
    return res.status(201).end()
  } 
}

export default AccountController