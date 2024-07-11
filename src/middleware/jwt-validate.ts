import { Prisma } from "@prisma/client"
import "dotenv/config"
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { RequestExt } from "../interfaces/req-ext"
import { UserService } from "../services/users.service"
import { RoleUser } from "../interfaces/lead.interface"


export interface JWTdata {
  data: { uid: string }
  iat: number
  exp: number
}

export interface JWTdataJobs {
  emit: string
  receiver: string
  id: string
}
export interface UserValidate {
  success: boolean
  message?: string
  user?: Prisma.UserUncheckedCreateInput
}

export interface DataExpress {
  req: RequestExt
  res: Response
  next: NextFunction
}

  const userService = new UserService()

  function verifyToken(token: string): Promise< JWTdata | string > {

    return new Promise((result, reject) => {
      const secret = `${process.env.JWT_SECRET}`;

      if(!token || typeof(token) !== 'string'){
        reject('Token no existe o no es String')
      }

      try {
        const decoded = verify( token, secret );
        const decode: JWTdata = decoded as unknown as JWTdata
        result(decode)

      } catch (error: any) {
        console.log('error verifyToken = ', error)
        //result (`Token Errado, no valido`)
        result(error)
      }
    })
  }

  /**
   * Recibe la request, extrae el token, lo decodifica para obtener el Id del usuario que luego retorna
   * @param req Request data para validaciones
   * @returns 
   */
  function decodeToken(req: Request): Promise<UserValidate> {
    return new Promise(async (result, reject) => {
      try {
        const tokenHeader = req.header('Authorization') || '';
        const tokenArray: string[] = tokenHeader.split(" ");

        if(!tokenArray[1]){

          result({
            success: false,
            message: 'Token Not Found in request',
          })
        }

        const decode: JWTdata = await verifyToken( tokenArray[1] ) as JWTdata

        if(!decode.data.uid || decode.data.uid === ''){
          result({
            success: false,
            message: 'Error: Token invalid, retry again or Login',
          })
        } else {
          //Token validate
          const userFind = await userService.getOne( decode.data.uid )

          if(userFind){
            result({
              success: true,
              user: userFind
            })

          } else {
            result({
              success: false,
              message: 'Error: Token invalid, retry again or Login',
            })
          }
       
        }
        
      } catch (error) {
        console.log('err catch = ', error)

        if(error === 'JsonWebTokenError: invalid signature'){
          result({
            success: false,
            message: 'Token no valido',
          })
        } else {
          reject(error)
        }
      }
    })
  }

  async function permission(express: DataExpress, type: RoleUser) {

    const data: UserValidate = await decodeToken(express.req);
    if (data.success && data.user) {

      if (data.user.role === 'ADMIN') {
        //SUPERADMIN TIENE ACCESO TOTAL
        express.next()
      } else if (data.user.role === type) {
        express.next()
      } else {
        express.res.status(401).json({
          success: false,
          message: 'El Usuario no tiene los permisos necesarios'
        })
      }
  
    } else {
      return express.res.status(401).json({
        success: false,
        message: data.message
      })
    }
  }

  //PERSMISSION FOR ROLE USER
  export function AdminPermission(req: RequestExt, res: Response, next: NextFunction) {
    return permission({ req, res, next }, 'ADMIN')
  }

  export function closerPermission(req: RequestExt, res: Response, next: NextFunction) {
    return permission({ req, res, next }, 'CLOSER')
  }