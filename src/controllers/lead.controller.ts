import { Request, Response } from 'express'
import { handleHttp } from '../helpers/error.handler'
import { LeadService } from '../services/leads.service'
import { Prisma, StateLead } from '@prisma/client'
import { SheetService } from '../services/spredsheet.service'

const leadService = new LeadService()
const sheetService = new SheetService()

async function getAllLeads(req: Request, res: Response) {
    try {
        const leads = await leadService.getMany()
        res.status(200).json({
            success: true,
            data: leads
        })
        
    } catch (error) {
        handleHttp(res, 'Error in getAll Leads', error)
    }
    //  try {
    //     const sheetReady = await sheetService.createSheet()
    //     if(sheetReady){
    //         const leads = await leadService.getMany()
    //         res.status(200).json({
    //             success: true,
    //             data: sheetService.sheetData
    //         })
    //     } else {
    //         res.status(200).json({
    //             success: false,
    //             message: 'Error in createSheet'
    //         })
    //     }
        
        
    // } catch (error) {
    //     handleHttp(res, 'Error in getAll Leads', error)
    // }
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
   
        const { state, id } = req.body

        console.log('changeState = ', req.body)

        const updateDocGoogle = await sheetService.updateStatusRow(Number(id), state)

        if(updateDocGoogle){
            const updatedLead = await leadService.updateUsingRow(id, state)
            res.status(200).json({
                success: true,
                message: `Change State Lead Row ${updatedLead.id_row} successfully`
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'Error Update Sheet in Google'
            })
        }
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

async function chargeDataSheet(req: Request, res: Response) {
    try {
        const charged = await sheetService.createSheet()
        if(charged){
            res.status(200).json({
                success: true,
                data: 'Shett migrate to Database successfully'
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'Error in migrate sheet to Database'
            })
        }
    } catch (error) {
        handleHttp(res, 'Error in deleteLead', error)
    }
}


export { getAllLeads, getOneLead, createLead, changeStateLead, updateLead, deleteLead, chargeDataSheet }