import { v4 as generateUUID } from 'uuid'

import Account from '../database/Entities/Account' 
import { accounts } from '../database/database' 

class AccountServices
{
  findAll(): Array<Account>
  {
    return accounts
  }

  findOne({ id }: Pick<Account, 'id'>): Account | void
  {
    const account = accounts.find(account => account.id === id)

    if(!account) throw new Error('404/Account not found')
    else         return account
  }

  verifyAccountAlreadyExists({ cpf }: Pick<Account, 'cpf'>, returnAccount: boolean): Account | void
  {
    const account = accounts.find(account => account.cpf === cpf)

    if(returnAccount && !account) throw new Error('404/Account not found') 
    if(!returnAccount && account) throw new Error('400/Account already exists')
    if(returnAccount && account)  return account
  }
  create({ name, cpf }: Pick<Account, 'name' | 'cpf'>): void
  {
    accounts.push({ cpf, name, statement: [], id: generateUUID() }) 
  }
}

export default AccountServices