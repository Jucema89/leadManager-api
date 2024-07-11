import { Prisma } from "@prisma/client";

export type StateLead =  'unmanaged' | 'contacted' | 'await_answer' | 'in_call' | 'win' | 'close'

export type RoleUser = 'ADMIN' | 'CLOSER'

export interface LeadRow {
    id: string;
    id_row: number;
    agendacion: Date;
    email: string;
    utm_source: string;
    utm_campaign: string;
    utm_medium: string;
    utm_term: string;
    utm_content: string;
    state: StateLead
    closer_name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type LeadRowCreate = Omit<LeadRow, 'id' | 'state' | 'createdAt' | 'updatedAt'>;

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    password: string;
    leadsAssign: LeadRow[];
    createdAt: Date;
    updatedAt: Date;
}

export enum Role {
    ADMIN = 'ADMIN',
    CLOSER = 'CLOSER'
}