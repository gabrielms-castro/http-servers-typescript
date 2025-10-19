import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';
import { getBearerToken, hashPassword, validateJWT } from './auth.js';
import { editUserCredentials } from '../db/queries/users.js';

export async function handlerEditUserCredentials(req: Request, res: Response) {
    // change user's email and/or password

    // Check auth first
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new UnauthorizedError("No Authorization header provided.");
    
    const token = getBearerToken(req);
    const sub = validateJWT(token, process.env.TOKEN_STRING!) //subscriber is USER ID

    // Only then we check request's body
    type Parameters = {
        email: string,
        password: string
    }
    const requestBody: Parameters = req.body;
    const email = requestBody.email;
    const password = requestBody.password;
    if (!email || !password) throw new BadRequestError("Please provide an valid email and a password.");
    
    // Change password in the database/ create new hashed password
    const hashedPassword = await hashPassword(password);
    const result = await editUserCredentials(sub, email, hashedPassword);

    return res.status(200).json({
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    });
}