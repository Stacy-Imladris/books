import type {NextFunction, Request, Response} from 'express';
import {HTTP_STATUSES} from '../utils';
import * as dotenv from 'dotenv'
dotenv.config()

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers['authorization']
    if (!authToken || authToken !== process.env.BASIC_AUTH_TOKEN) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    } else {
        next()
    }
}