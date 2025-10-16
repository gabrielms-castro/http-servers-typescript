import type { Request, Response } from "express";

import { getUser } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { checkPasswordHash } from "./auth.js";
import { UserResponse } from "src/db/schema.js";

export async function handlerLogin(req: Request, res: Response) {
    type Parameters = { email: string, password: string }
    const requestBody: Parameters = req.body;
    const email = requestBody.email
    const password = requestBody.password

    if (!email || !password) {
        throw new BadRequestError("Please provide an email and a password.")
    }
    
    const queryUser = await getUser(email)
    if (!queryUser) throw new UnauthorizedError('Incorrect email or password');

    const matching = await checkPasswordHash(password, queryUser.hashedPassword);
    if (!matching) {
        throw new UnauthorizedError('Incorrect email or password');
    }

    res.status(200).json({
        id: queryUser.id,
        email: queryUser.email,
        createdAt: queryUser.createdAt,
        updatedAt: queryUser.updatedAt
    } satisfies UserResponse);
}