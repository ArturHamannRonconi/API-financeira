import { Router } from 'express'

import AccountController from './controllers/AccountController'
import AccountMiddlewares from './middlewares/AccountMiddlewares'

const router = Router()


const accountController = new AccountController()
const accountMiddlewares = new AccountMiddlewares()

router.use(
  [ '/statement/:cpf', '/deposit', '/withdraw', '/balance/:cpf' ],
  accountMiddlewares.verifyAccountExists
)

router.route('/accounts')
  .get(accountController.findAll)
  .post(
    accountMiddlewares.verifyIfAccountAlreadyCreated,
    accountController.create
  )
  
router.route('/accounts/:id')
  .get(accountController.findOne)
  .put(
    accountMiddlewares.verifyAccountExists,
    accountController.update
  )
  .delete(
    accountMiddlewares.verifyAccountExists,
    accountController.delete
  )

router.route('/statement/:cpf')
  .get(accountController.getStatement)

router.route('/balance/:cpf')
  .get(accountController.getBalance)

router.route('/deposit')
  .post(accountController.deposit)

router.route('/withdraw')
  .post(
    accountMiddlewares.getBalance,
    accountController.withdraw
  )

export default router