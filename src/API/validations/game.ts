import { check } from 'express-validator'

export const gameValidations =  [
    check('page').exists().isNumeric(),
    check('pageSize').exists().isNumeric(),
    check('orderBy').exists().isString(),
]

