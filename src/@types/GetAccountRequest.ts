import { Request } from 'express'

interface GetAccountRequest extends Request 
{
  account: Account
}

export default GetAccountRequest