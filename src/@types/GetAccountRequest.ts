import { Request } from 'express'

import Account from './Account'

interface GetAccountRequest extends Request 
{
  account: Account
}

export default GetAccountRequest