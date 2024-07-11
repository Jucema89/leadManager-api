import { Request, Response } from 'express'
import { handleHttp } from '../helpers/error.handler'
import { createJWT } from '../helpers/jwt';
import { UserService } from '../services/users.service';

const service = new UserService()

async function login(req: Request, res: Response) {

    const { email, password } = req.body;

    try {
        const userFind = await service.getByEmail( email );
        if(userFind){

            //const validPass = crypter.compareSync( password, userFind.password)
            const validPass = userFind.password === password;
            if(validPass){

                const { password, ...rest } = userFind;

                const token = await createJWT(userFind.id);

                return res.status(200).json({
                    success: true,
                    token: token,
                    user: rest
                });

            } else {
                //password wrong
                return res.status(200).json({
                    success: false,
                    message: 'email o password wrong'
                });
            }
        } else {
            //email wrong
            return res.status(200).json({
                success: false,
                message: 'There are no users with this email'
            });
        }

    } catch (error) {
        handleHttp(res, 'ERROR_LOGIN_USER', error)
    }
}

export {
    login
}