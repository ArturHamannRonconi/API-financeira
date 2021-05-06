import { v4 as generateUUID } from 'uuid'

import { accounts } from '../database/DB'

import {
  Account,
  Statement,
} from '../@types' 

class AccountServices
{
  findAll(): Array<Account>
  {
    return accounts
  }

  findOne<attrType>({ attrName, attrValue }: { attrName: string, attrValue: attrType }): Account | void
  {
    const account = accounts.find(account => account[attrName] === attrValue)
    
    if(!account) throw new Error('404/Account not found')
    else         return account
  }

  create({ name, cpf }: Pick<Account, 'name' | 'cpf'>): void
  {
    accounts.push({ cpf, name, statement: [], id: generateUUID() }) 
  }

  update({ name }: Partial<Account>, account: Account): void
  {
    account.name = name
  }

  delete(account: Account): void
  {
    const accountIndex = accounts.indexOf(account)
    accounts.splice(accountIndex, 1)
  }

  deposit(statement: Statement, account: Account): void
  {
    account.statement.push(statement)
  }

  withdraw(statement: Statement, account: Account): void
  {
    account.statement.push(statement)
  }

  orderByDate({ date, statement }: { date: string, statement: Array<Statement> }): Statement[]
  {
    const dateFormat = new Date(`${date} 00:00`)
    return statement.filter(operation =>
      new Date(operation.created_at).toDateString()
      ===
      dateFormat.toDateString()
    )
  }

  getBalance(account: Account): number
  {
    return account.statement.reduce((acc, operation) => {
      operation.type === 'credit' ? acc += operation.amount : acc -= operation.amount
      return acc
    }, 0)
  }
}

export default AccountServices