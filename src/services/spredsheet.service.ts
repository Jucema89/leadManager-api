import "dotenv/config"
import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../conf/creds_google.json'
import { JWT } from 'google-auth-library';
import { LeadRow, LeadRowCreate } from "../interfaces/lead.interface";
import prisma from "../database/prisma";
import { StateLead } from "@prisma/client";

export class SheetService {

    private serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    private sheetId: string = '1QX9_3gLUVP5_I3kaGxnqS9-6Ji4PMYbR8_oEBIbpys8'

    //sheetData: LeadRowCreate[] = []

    transformDate = (date: string): Date => {
        if (typeof(date) === 'string' && date !== '') {
            const [day, month, year] = date.split('/');
            return new Date(`${year}-${month}-${day}`);
        } else {
            return new Date();
        }
    }

    updateStatusRow(idRow: number, data: string): Promise<{success: boolean, message: string}>{
        return new Promise(async (result, reject) => {
            try {
                const doc = new GoogleSpreadsheet(
                    this.sheetId, 
                    this.serviceAccountAuth
                )

                await doc.loadInfo()
                const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
                const rows = await sheet.getRows()
                const rowFind = rows.find((row) => row.rowNumber === idRow)
                if(rowFind){
                    rowFind.set('State', data)
                    await rowFind.save()
                    result({
                        success: true,
                        message: 'Row Update'
                    })
                } else {
                    result({
                        success: false,
                        message: `Row ${idRow} Not Found`
                    })
                }
            } catch (error) {
                console.log('error = ', error)
                result({
                    success: false,
                    message: `Error: ${error}`
                })
            }
        })
    }

    createSheet(): Promise<boolean> {
        return new Promise(async (result, reject) => {
            try {
                const doc = new GoogleSpreadsheet(this.sheetId, this.serviceAccountAuth)
                //console.log('doc = ', doc)
                await doc.loadInfo()
                console.log(doc.title);
    
                const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
                console.log(sheet.title);
                console.log(sheet.rowCount);
    
                const rows = await sheet.getRows()
                for(let row of rows){
                    let data: LeadRowCreate = {
                        id_row: Number(row.rowNumber),
                        agendacion: this.transformDate(row.get('Agendacion')),
                        email: row.get('Email'),
                        utm_source: row.get('UTM Source'),
                        utm_campaign: row.get('UTM Campaign'),
                        utm_medium: row.get('UTM Medium'),
                        utm_term: row.get('UTM Term'),
                        utm_content: row.get('UTM Content'),
                        closer_name: row.get('Closer'),
                    }

                    console.log('row itarate = ', data.id_row)

                    await prisma.lead.create({
                        data: data
                    })
                }

                result(true)
                
            } catch (error) {
                result(false)
                console.log('error = ', error)
            }
        })
    }

}

