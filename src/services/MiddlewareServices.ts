import { accounts } from '../database/DB'
import { Account } from '../@types'

class MiddlewareServices
{
  verifyIfAccountAlreadyCreated({ cpf }: Pick<Account, 'cpf'>): void
  {
    const account = accounts.some(account => account.cpf === cpf)
    if(account) throw new Error('400/Account already exists')
  }
  
  verifyAccountExists({ cpf, id }: Partial<Account>): void
  {
    const accountExists = accounts.some(account => account.cpf === cpf || account.id === id)
    if(!accountExists) throw new Error('404/Account not found') 
  }
}

export default MiddlewareServices