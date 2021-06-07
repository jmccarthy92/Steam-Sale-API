import { UserService } from '@Business/services';
import { hashPassword } from '@Core/shared/auth';
import * as PassportJS from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export default class Passport {

    public static setUp(){
        const userService = new UserService();
        PassportJS.use(
            new LocalStrategy(
                {
                    usernameField: 'email',
                    passwordField: 'password',
                },
                /**
                 * gets the user through email and validates the password.
                 * @param {string} email
                 * @param {string} password
                 * @param {function(string, UserDTO, string)} callback - callback to return the error msg and the user obj
                 * @see UserController.localLogin
                 */
                async (email: string, password: string, done) => {
                    const user = await userService.getUserByEmail(email, 'password');
                    if (!user) {
                        return done(null, false, { message: 'No User found.' });
                    }
                    const { password: userPassword = { hash: '', salt: ''} } = user;
                    if(userPassword.hash !== hashPassword(password, userPassword.salt) ){
                         return done(null, false, {
                            message: 'Password Incorrect.',
                        });    
                    }
                    return done(null, user, { message: 'login successful' });
                },
            ),
        );
    }
}