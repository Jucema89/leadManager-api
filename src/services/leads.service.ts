import { Prisma, StateLead } from '@prisma/client';
import prisma from '../database/prisma';
import e from 'express';
import { error } from 'console';

export class LeadService {

    getMany(page: number = 1, pageSize: number = 50, filters?: any) {
        const skip = (page - 1) * pageSize;
        return prisma.lead.findMany({
            skip: skip,
            take: pageSize,
            where: filters,
        });
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

    async update(id: string, payload: Prisma.LeadUpdateInput) {
        return await prisma.lead.update({
            where: { id: id },
            data: payload,
        })
    }


    async updateUsingRow(id: number, state: string) {

        const lead = await prisma.lead.findFirst({
            where: { id_row: id },
        })

        if(lead){
            return await prisma.lead.update({
                where: { id: lead.id },
                data: {
                    ...lead,
                    state: state as StateLead
                }
            })
        } else {
            throw error('Lead not found')
        }
    }

    async changeState(id: string, state: StateLead) {
        return await prisma.lead.update({
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