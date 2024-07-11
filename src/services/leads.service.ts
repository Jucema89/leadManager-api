import { Prisma, StateLead } from '@prisma/client';
import prisma from '../database/prisma';

export class LeadService {

    getMany(filters?: any) {
        return prisma.lead.findMany({})
    }

    getOne(id: string) {
        return prisma.lead.findUnique({
            where: { id: id },
        })
    }

    create(payload: Prisma.LeadCreateInput) {
        return prisma.lead.create({
            data: payload,
        })
    }

    update(id: string, payload: Prisma.LeadUpdateInput) {
        return prisma.lead.update({
            where: { id: id },
            data: payload,
        })
    }

    changeState(id: string, state: StateLead) {
        return prisma.lead.update({
            where: { id: id },
            data: { 
                state: state 
            },
        })
    }

    deleteById(id: string): Promise<{ success: boolean, message: string }> {
        return new Promise(async(result, reject) => {
          const deletedFile = await prisma.lead.delete({
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