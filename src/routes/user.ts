import { Router } from "express";
import { check } from "express-validator";
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser } from "../controllers/user.controller";
import { AdminPermission } from "../middleware/jwt-validate";

const router = Router()

router
    .get('/alls', AdminPermission, getAllUsers)
    .get('/one', AdminPermission, getOneUser)
    .post('/create', createUser)
    .put('/update', AdminPermission, updateUser)
    .delete('/delete', AdminPermission, deleteUser)

export { router }
