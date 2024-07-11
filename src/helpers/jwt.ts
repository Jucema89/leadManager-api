import "dotenv/config"
import { JwtPayload, sign, TokenExpiredError, verify }  from 'jsonwebtoken'
const secret: string = `${process.env.JWT_SECRET}` || '63maZcyxp4V9vgqJKk8XUp99bSJ'

function createJWT( uid: string ): Promise<string> {
    return new Promise((resolve, reject) => {
        const payload =  { uid }
        sign({
            data: payload
          }, secret, { expiresIn: '8h' }, (err, token) => {
    
            if(err){
                console.log(err);
                reject('SERVER_ERROR: We can`t make a token')
            } else {
                resolve(String(token))
            }
        });
    });
}

function verifyToken(jwt: string): string | JwtPayload {
    const isOk = verify(jwt, secret)
    return isOk;
}


function verifyFullToken(jwt: string) {
    return verify(jwt, secret, ((err, decode) => {
        if(err){        
            console.log('error token = ', err)
            
            const newError = err as TokenExpiredError
            return {
                success: false,
                name: err.name,
                message: err.message,
                exp: newError.expiredAt,
            }
        }

        if(decode){
            return {
                success: true,
                ...decode as JwtPayload
            }
        }
    }));
};

function decodedToken(token: string){ 
   return verify(token, secret)
}

function makePass( length: number ) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function renewPasswordToken(id: string){
    return sign({ id: id }, secret, { expiresIn: '1h' })
}

function completeProfileToken(id: string){
    return sign({ id: id }, secret, { expiresIn: '24h' })
}

export {
    createJWT,
    verifyToken,
    makePass,
    renewPasswordToken,
    verifyFullToken,
    completeProfileToken
}