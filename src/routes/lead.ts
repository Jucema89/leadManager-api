import { Router } from "express";
import { check } from "express-validator";
import { getAllLeads, getOneLead, createLead, changeStateLead, updateLead, deleteLead } from "../controllers/lead.controller";
import { AdminPermission, closerPermission } from "../middleware/jwt-validate";

const router = Router()

router
    .get('/alls', closerPermission, getAllLeads)
    .get('/one', closerPermission, getOneLead)
    .post('/create', closerPermission, createLead)
    .put('/update', closerPermission, updateLead)
    .put('/change-state', closerPermission, changeStateLead)
    .delete('/delete', AdminPermission, deleteLead)


export { router }