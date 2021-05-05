import { Router } from 'express'
import { v4 as generateUUID } from 'uuid'

import ID from './@types/ID'
import Account from './@types/Account'
import GetAccountRequest from './@types/GetAccountRequest'
import { accounts } from './database/database'
import { verifiyExistsAccount } from './middlewares'

const routes = Router()

routes.route('/accounts')
  .get((req, res) => res.json({ error: null, result: accounts }))
  .post((req, res) => {
    try {
      const { cpf, name } = req.body as Account
      
      if(accounts.some(account => account.cpf === cpf))
        throw new Error('400/Account already exists') 
      
      accounts.push({
        cpf,
        name,
        statement: [],
        id: generateUUID()
      }) 
      
      return res
        .status(201)
        .end() 
    } catch(error) {
      const [ statuCode, message ] = error.message.split('/')

      return res
        .status(statuCode)
        .json({ error: message, result: null })
    }
  })

routes.get('/accounts/:id', (req, res) => {
  const { id } = req.params as ID
  const account = accounts.find(account => account.id === id)
  
  return res.json({error: null, result: account})
})

routes.route('/statement')
  .get(verifiyExistsAccount, (req: GetAccountRequest, res) => res.json({ error: null, result: req.account.statement }))

export default routes