import { Request, Response, NextFunction } from 'express'

import Middleware from './Middleware'
import MiddlewareServices from '../services/MiddlewareServices'
import AccountServices from '../services/AccountServices'

import {
  GetAccountRequest,
  MiddlewareReturn,
  Account
} from '../@types'

const middlewareServices = new MiddlewareServices()
const accountServices = new AccountServices()

class AccountMiddlewares extends Middleware
{
  verifyIfAccountAlreadyCreated(req: Request, res: Response, next: NextFunction): MiddlewareReturn
  {
    return super.tryCatch(() => {
      let cpf: string
  
      if(req.method === 'POST') cpf = req.body.cpf as string
      if(req.method === 'GET')  cpf = req.params.cpf as string
      
      middlewareServices.verifyIfAccountAlreadyCreated({ cpf }) 
    }, res, next)
  }

  verifyAccountExists(req: GetAccountRequest, res: Response, next: NextFunction): MiddlewareReturn
  {
    return super.tryCatch(() => {
      const methods = {
        'POST': req.body,
        'GET': req.params,
        'PUT': req.params,
        'DELETE': req.params
      }

      const { cpf, id } = methods[req.method] as Pick<Account, 'cpf' | 'id'>

      middlewareServices.verifyAccountExists({ cpf, id })
      const accountFinders = {
        'GET': () => accountServices.findOne<string>({ attrName: 'cpf', attrValue: cpf }),
        'POST': () => accountServices.findOne<string>({ attrName: 'cpf', attrValue: cpf }),
        'PUT': () => accountServices.findOne<string>({ attrName: 'id', attrValue: id }),
        'DELETE': () => accountServices.findOne<string>({ attrName: 'id', attrValue: id })
      }
      
      req.account = accountFinders[req.method]()
    }, res, next)
  }

  getBalance(req: GetAccountRequest, res: Response, next: NextFunction): MiddlewareReturn
  {
    return super.tryCatch(() => {
      const { amount } = req.body
      const account = req.account as Account

      const balance = accountServices.getBalance(account)

      if(balance < amount) throw new Error('400/Insuficient funds')
    }, res, next)
  }
}

export default AccountMiddlewares