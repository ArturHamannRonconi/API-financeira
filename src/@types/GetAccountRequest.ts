import { Request } from 'express'

import Account from '../database/Entities/Account'

interface GetAccountRequest extends Request 
{
  account: Account
}

export default GetAccountRequest