import { Response } from 'express'

class Controller
{
  protected tryCatch(callback: CallableFunction, res: Response, statusCode: number): Response
  {
    try {

      const result = callback()

      return res.status(statusCode).json({ error: null, result })

    } catch (error) {

      const [ statuCode, message ] = error.message.split('/')
      return res.status(statuCode).json({ error: message, result: null })

    }
  }
}

export default Controller