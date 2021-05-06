import { Response, NextFunction } from 'express'

class Middleware
{
  protected tryCatch(callback: CallableFunction, res: Response, next: NextFunction): Response | void
  {
    try {
  
      callback()
      return next()
  
    } catch (error) {

      const [ statuCode, message ] = error.message.split('/')
      return res.status(statuCode).json({ error: message, result: null })

    }
  }
  
}

export default Middleware




