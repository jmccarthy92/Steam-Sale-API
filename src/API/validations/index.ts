import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = validationResult(req)
    if (validationErrors.isEmpty()) {
      return next()
    }
    const errors = validationErrors.array().map(({param, msg}): Record<string,any> => ({ [param]: msg }))
  
    return res.status(422).json({ errors })
  }

export * from '@API/validations/user';
export * from '@API/validations/game';