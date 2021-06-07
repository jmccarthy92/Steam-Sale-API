import { check } from 'express-validator'

export const userValidations =  [
    check('email').isEmail(),
    check('password')
    .isLength({ min: 5})
        // .custom(passwordsMatch)
        // .custom(passwordStrength),
]

export const userCanAccessEntity = [
    check('cookies.token.id').custom((id, { req }): boolean => id === req.prams.userId)
]
