import { Response, NextFunction } from 'express'

import { accounts } from './database/database'
import CPF from './@types/CPF'
import Account from './@types/Account'
import GetAccountRequest from './@types/GetAccountRequest'

function verifiyExistsAccount(req: GetAccountRequest, res: Response, next: NextFunction): NextFunction | Response
{
  try {    
    const { cpf } = req.params as CPF
    const account = accounts.find(account => account.cpf === cpf)
    req.account = account as Account

    if(!account) throw new Error('404/Account not found')
    else return next()

  } catch (error) {
    const [ statuCode, message ] = error.message.split('/')

    return res
      .status(statuCode)
      .json({ error: message, result: null })

  }
}

export { verifiyExistsAccount } 