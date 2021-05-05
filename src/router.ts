import { Router } from 'express'

import AccountController from './controllers/AccountController'

const router = Router()

const accountController = new AccountController() 

router.route('/accounts')
  .get(accountController.findAll)
  .post(
    accountController.verifyAccountAlreadyExists,
    accountController.create
  )

router.route('/accounts/:id')
  .get(accountController.findOne)


router.route('/statement/:cpf')
  .get(
    accountController.verifiyExistsAccount,
    accountController.getStatement
  )

router.route('/deposit')
  .post(
    accountController.verifiyExistsAccount,
    accountController.deposit
  )

export default router