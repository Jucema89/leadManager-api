import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

export class UserService {

    getMany(filters?: any) {
        return prisma.user.findMany({})
    }

    getOne(id: string) {
        return prisma.user.findUnique({
            where: { id: id },
        })
    }

    getByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email: email },
        })
    }

    create(payload: Prisma.UserCreateInput) {
        return prisma.user.create({
            data: payload,
        })
    }

    update(id: string, payload: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id: id },
            data: payload,
        })
    }

    deleteById(id: string): Promise<{ success: boolean, message: string }> {
        return new Promise(async(result, reject) => {
          const deletedFile = await prisma.user.delete({
            where: { id: id }
          })
          
          if(!deletedFile){
            throw new Error('not remeove Training using this id')
          } else {
            result({
                success: true,
                message: 'Lead Remove successfully'
            })
          }
        })
    }
}