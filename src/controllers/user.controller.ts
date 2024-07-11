import { Request, Response } from 'express'
import { handleHttp } from '../helpers/error.handler'
import { Prisma, StateLead } from '@prisma/client'
import { UserService } from '../services/users.service'

const userService = new UserService()

async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await userService.getMany()
        res.status(200).json({
            success: true,
            data: users
        })
        
    } catch (error) {
        handleHttp(res, 'Error in getAllUsers', error)
    }
}

async function getOneUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const user = await userService.getOne(id)
        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        handleHttp(res, 'Error in getOneUser', error)
    }
}


async function createUser(req: Request, res: Response) {
    try {
        const user = req.body as Prisma.UserCreateInput
        const newUser = await userService.create(user)
 
        res.status(201).json({
            success: true,
            data: newUser
        })
        
    } catch (error) {
        handleHttp(res, 'Error in createUser', error)
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const user = req.body as Prisma.UserUpdateInput

        const updatedUser = await userService.update(id, user)
        res.status(200).json({
            success: true,
            data: updatedUser
        })

    } catch (error) {
        handleHttp(res, 'Error in updateUser', error)
    }
}

async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deletedUser = await userService.deleteById(id)
        res.status(200).json({
            success: true,
            data: deletedUser
        })
    } catch (error) {
        handleHttp(res, 'Error in deleteUser', error)
    }   
        
}

export { getAllUsers, getOneUser, createUser, updateUser, deleteUser }
