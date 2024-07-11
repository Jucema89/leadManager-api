import { Request, Response } from 'express'
import { handleHttp } from '../helpers/error.handler'
import { LeadService } from '../services/leads.service'
import { Prisma, StateLead } from '@prisma/client'

const leadService = new LeadService()

async function getAllLeads(req: Request, res: Response) {
    try {
        const leads = await leadService.getMany()
        res.status(200).json({
            success: true,
            data: leads
        })
        
    } catch (error) {
        handleHttp(res, 'Error in createTraining', error)
    }
}

async function getOneLead(req: Request, res: Response) {
    try {
        const { id } = req.params
        const lead = await leadService.getOne(id)
        res.status(200).json({
            success: true,
            data: lead
        })

    } catch (error) {
        handleHttp(res, 'Error in getOneLead', error)
    }
}


async function createLead(req: Request, res: Response) {
    try {
        const lead = req.body as Prisma.LeadCreateInput
        const newLead = await leadService.create(lead)
 
        res.status(201).json({
            success: true,
            data: newLead
        })
        
    } catch (error) {
        handleHttp(res, 'Error in createLead', error)
    }
}

async function updateLead(req: Request, res: Response) {
    try {
        const { id } = req.params
        const lead = req.body as Prisma.LeadUpdateInput

        const updatedLead = await leadService.update(id, lead)
        res.status(200).json({
            success: true,
            data: updatedLead
        })

    } catch (error) {
        handleHttp(res, 'Error in updateLead', error)
    }
}

async function changeStateLead(req: Request, res: Response) {
    try {
        const { id } = req.params
        const state = req.body as StateLead

        const updatedLead = await leadService.changeState(id, state)
        res.status(200).json({
            success: true,
            data: updatedLead
        })

    } catch (error) {
        handleHttp(res, 'Error in changeStateLead', error)
    }
}


async function deleteLead(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deletedLead = await leadService.deleteById(id)
        res.status(200).json({
            success: true,
            data: deletedLead
        })
    } catch (error) {
        handleHttp(res, 'Error in deleteLead', error)
    }   
        
}


export { getAllLeads, getOneLead, createLead, changeStateLead, updateLead, deleteLead }