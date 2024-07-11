import { Router } from "express";
import { check } from "express-validator";
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser } from "../controllers/user.controller";
import { AdminPermission } from "../middleware/jwt-validate";
import { login } from "../controllers/auth";

const router = Router()

router
    .post('/login', login)
    .get('/validate-token',
        // allPermission,
         (req, res) =>
             res.status(200).json({
                 success: true,
                 data: 'Token Valido'
             })
     )

export { router }